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
}
