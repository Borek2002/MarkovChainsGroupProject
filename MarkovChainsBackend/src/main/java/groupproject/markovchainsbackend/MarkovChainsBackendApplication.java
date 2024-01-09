package groupproject.markovchainsbackend;

import groupproject.markovchainsbackend.markovchain.MarkovChain;
import org.apache.commons.math3.linear.Array2DRowRealMatrix;
import org.apache.commons.math3.linear.ArrayRealVector;
import org.apache.commons.math3.linear.RealMatrix;
import org.apache.commons.math3.linear.RealVector;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MarkovChainsBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(MarkovChainsBackendApplication.class, args);
        double[][] matrixData = {
                {1.0,0.5, 0.25},
                {0.0, 0.5,0.25},
                {0.0,0.0,0.5}
        };
        double[][] matrixData2 = {
                {0.0,0.25},
                {1.0, 0.75}
        };
        double[] initialVectorData = {0.7,0.3}; // Przykładowy wektor początkowy

        RealMatrix transitionMatrix = new Array2DRowRealMatrix(matrixData2);
        RealVector initialVector = new ArrayRealVector(initialVectorData);

        MarkovChain markovChain = new MarkovChain(transitionMatrix, initialVector);
        RealVector result = markovChain.calculateProbabilityVectorAfterNSteps(5);
        MarkovChain.printVector(result);

        RealVector result2 = markovChain.calculateFinalProbabilityVector();
        //MarkovChain.printVector(result2);

    }

}