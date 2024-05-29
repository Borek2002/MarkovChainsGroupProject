package groupproject.markovchainsbackend.markovchain;

import groupproject.markovchainsbackend.dto.MarkovRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.math3.linear.*;
import org.springframework.stereotype.Component;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Component
public class MarkovChain {
    private RealMatrix transitionMatrix;
    private RealVector initialVector;
    private int steps;
    private int currentState = -1;

    public MarkovChain(RealMatrix transitionMatrix, RealVector initialVector) {
        this.transitionMatrix = transitionMatrix;
        this.initialVector = initialVector;
    }

    public RealVector calculateProbabilityVectorAfterNSteps(int n) {
        RealVector result = initialVector;

        for (int i = 0; i < n; i++) {
            result = transitionMatrix.operate(result);
        }
        return result;
    }

    public RealVector calculateStationaryDistribution() {  //metoda potęgowa
        int maxIterations = 1000;
        double epsilon = 1e-10;

        int dimension = transitionMatrix.getRowDimension();
        RealVector initialGuess = new ArrayRealVector(new double[dimension]).mapAddToSelf(1.0);
        initialGuess.mapMultiplyToSelf(1.0 / dimension);

        for (int i = 0; i < maxIterations; i++) {
            RealVector nextGuess = transitionMatrix.operate(initialGuess);

            if (nextGuess.subtract(initialGuess).getNorm() < epsilon) {
                return nextGuess.mapDivide(nextGuess.getL1Norm());
            }
            initialGuess = nextGuess;
        }
        throw new RuntimeException("Błąd przy wyliczeniu prawdopodobieństwa stacjonarnego");
    }

    public int getImmersiveState() {
        int immersive = -1;
        for (int i = 0; i < this.transitionMatrix.getColumnDimension(); i++) {
            for (int j = 0; j < this.transitionMatrix.getRowDimension(); j++) {
                if (i == j && this.transitionMatrix.getEntry(i, j) == 1) {
                    immersive = i;
                }
            }
        }
        return immersive;
    }

    public boolean checkImmersiveState() {
        return getImmersiveState() >= 0;
    }

    public boolean checkOddsAmountEqualOne(double[][] matrix) {
        for (int i = 0; i < matrix.length; i++) {
            double rowSum = 0.0;
            for (int j = 0; j < matrix[i].length; j++) {
                rowSum += matrix[i][j];
            }
            if (Math.abs(rowSum - 1.0) > 1e-10) {
                return false;
            }
        }
        return true;
    }

    public RealVector calculateFinalProbabilityVector() {
        // Obliczanie wartości własnych i wektorów własnych
        EigenDecomposition eigenDecomposition = new EigenDecomposition(transitionMatrix);

        // Pobieranie macierzy wektorów własnych
        RealMatrix eigenvectorMatrix = eigenDecomposition.getV();

        // Macierz diagonalna z wartościami własnymi
        RealMatrix diagonalMatrix = MatrixUtils.createRealDiagonalMatrix(eigenDecomposition.getRealEigenvalues());

        // Macierz odwracalna P
        RealMatrix inverseP = MatrixUtils.inverse(eigenvectorMatrix);

        // Obliczanie macierzy P^(-1) * D^n * P dla n dążącego do nieskończoności
        RealMatrix PInverseDToInfinityP = eigenvectorMatrix.multiply(MatrixUtils.createRealDiagonalMatrix(diagonalToInfinity(diagonalMatrix))).multiply(inverseP);

        // Przemnóż wektor początkowy przez uzyskaną macierz
        RealVector finalVector = PInverseDToInfinityP.operate(initialVector);

        // Wyświetlanie wyników
        System.out.println("Macierz A:");
        MarkovChain.printMatrix(transitionMatrix);

        System.out.println("Macierz diagonalna D:");
        MarkovChain.printMatrix(diagonalMatrix);

        System.out.println("Macierz odwracalna P:");
        MarkovChain.printMatrix(eigenvectorMatrix);

        System.out.println("Macierz odwracalna P^-1:");
        MarkovChain.printMatrix(inverseP);

        System.out.println("PInverseDToInfinityP:");
        MarkovChain.printMatrix(PInverseDToInfinityP);

        System.out.println("Wektor prawdopodobieństw finalnych dla n dążącego do nieskończoności:");
        MarkovChain.printVector(finalVector);
        return finalVector;
    }

    // Metoda dla uniknięcia wartości NaN dla nieskończoności
    private static double[] diagonalToInfinity(RealMatrix diagonalMatrix) {
        int size = diagonalMatrix.getRowDimension();
        double[] diagonalElements = new double[size];
        for (int i = 0; i < size; i++) {
            diagonalElements[i] = Math.pow(diagonalMatrix.getEntry(i, i), Integer.MAX_VALUE);
        }
        return diagonalElements;
    }

    public Integer simulate(int steps) {
        System.out.println("Simulation started. Initial state: " + currentState);
        if(currentState < 0){
            double randomValue = Math.random();
            double cumulativeProbability = 0.0;

            for (int nextState = 0; nextState < initialVector.getDimension(); nextState++) {
                cumulativeProbability += initialVector.getEntry(nextState);
                System.out.println("vector" + nextState);
                System.out.println("vector" + randomValue);
                System.out.println("vector" + cumulativeProbability);
                if (randomValue <= cumulativeProbability) {
                    currentState = nextState + 1;
                    return currentState;
                }
            }
            // This should never happen if the transition matrix is correctly defined
            throw new RuntimeException("Invalid transition probabilities");
        }
        else{
            for (int i = 0; i < steps; i++) {
                int nextState = getNextState();
                System.out.println("Step " + (i + 1) + ": Moved from state " + currentState + " to state " + nextState);
                currentState = nextState;
            }
            System.out.println("Simulation completed.");
            return currentState;
        }

    }


    private int getNextState() {
        double[] probabilities = transitionMatrix.getRow(currentState-1);
        double randomValue = Math.random();
        double cumulativeProbability = 0.0;

        for (int nextState = 0; nextState < probabilities.length; nextState++) {
            cumulativeProbability += probabilities[nextState];
            System.out.println(nextState);
            System.out.println(randomValue);
            System.out.println(cumulativeProbability);
            if (randomValue <= cumulativeProbability) {
                return nextState + 1;
            }
        }
        // This should never happen if the transition matrix is correctly defined
        throw new RuntimeException("Invalid transition probabilities");
    }


    public MarkovRequest getMatrixAndVector(){
        return MarkovRequest.builder()
                .initialVector(this.initialVector.toArray())
                .transitionMatrix(this.transitionMatrix.getData())
                .build();
    }

    public void setMatrixAndVector(MarkovRequest request) {
        this.initialVector = new ArrayRealVector(request.getInitialVector());
        this.transitionMatrix = new Array2DRowRealMatrix(request.getTransitionMatrix());
    }

    public static void printMatrix(RealMatrix matrix) {
        for (int i = 0; i < matrix.getRowDimension(); i++) {
            for (int j = 0; j < matrix.getColumnDimension(); j++) {
                System.out.print(matrix.getEntry(i, j) + " ");
            }
            System.out.println();
        }
    }

    public static void printVector(RealVector vector) {
        for (int i = 0; i < vector.getDimension(); i++) {
            System.out.println(vector.getEntry(i) + " ");
        }
    }
}
