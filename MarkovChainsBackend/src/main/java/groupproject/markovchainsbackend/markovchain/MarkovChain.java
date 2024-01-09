package groupproject.markovchainsbackend.markovchain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.math3.linear.*;
import org.springframework.stereotype.Component;

import javax.management.ConstructorParameters;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Component
public class MarkovChain {
    private RealMatrix transitionMatrix;
    private RealVector initialVector;

    public RealVector calculateProbabilityVectorAfterNSteps(int n) {
        RealVector result = initialVector;

        for (int i = 0; i < n; i++) {
            result = transitionMatrix.operate(result);
        }

        return result;
    }

    public RealVector calculateStationaryDistribution() {
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
}
