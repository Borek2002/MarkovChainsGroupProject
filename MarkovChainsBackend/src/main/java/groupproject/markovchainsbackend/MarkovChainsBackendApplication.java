package groupproject.markovchainsbackend;

import groupproject.markovchainsbackend.markovchain.MarkovChain;
import groupproject.markovchainsbackend.markovchain.ProbabilityChart;
import org.apache.commons.math3.linear.Array2DRowRealMatrix;
import org.apache.commons.math3.linear.ArrayRealVector;
import org.apache.commons.math3.linear.RealMatrix;
import org.apache.commons.math3.linear.RealVector;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

@SpringBootApplication
public class MarkovChainsBackendApplication {

    private static MarkovChain markovChain;

    public static void main(String[] args) {
        //SpringApplication.run(MarkovChainsBackendApplication.class, args);

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
        MarkovChain.printVector(result2);


        JFrame frame = new JFrame("Markov Chain Visualization");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JPanel panel = new JPanel();

        JButton visualizeButton = new JButton("Visualize Markov Chain");
        JButton calculateButton = new JButton("Calculate Probability Vector");

        panel.add(visualizeButton);
        panel.add(calculateButton);

        frame.getContentPane().add(panel);

        frame.setSize(300, 100);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);

        visualizeButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                showMarkovChainVisualization();
            }
        });

        calculateButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                calculateProbabilityVector();
            }
        });

        initializeMarkovChain();
        System.out.println(markovChain.getImmersiveState());
        System.out.println(markovChain.checkImmersiveState());
    }
        private static void initializeMarkovChain () {
            RealMatrix transitionMatrix = new Array2DRowRealMatrix(new double[][]{{0.1, 0.5, 0.25}, {0.9, 0.5, 0.25}, {0.0, 0.0, 0.5}});
            RealVector initialVector = new ArrayRealVector(new double[]{0.0, 0.0, 1.0});
            markovChain = new MarkovChain(transitionMatrix, initialVector,1);
        }

        private static void showMarkovChainVisualization() {
            SwingUtilities.invokeLater(() -> {
                ProbabilityChart chart = new ProbabilityChart(markovChain);
                chart.pack();
                chart.setLocationRelativeTo(null);
                chart.setVisible(true);
            });
        }

        private static void calculateProbabilityVector() {
            int steps = getNumberOfStepsFromUser();

            RealVector result = markovChain.calculateProbabilityVectorAfterNSteps(steps);

            JOptionPane.showMessageDialog(null, "Probability Vector after " + steps + " steps:\n" + result.toString());
        }

        private static int getNumberOfStepsFromUser() {
            String input = JOptionPane.showInputDialog("Enter the number of steps:");
            try {
                markovChain.setSteps(Integer.parseInt(input));
                return Integer.parseInt(input);
            } catch (NumberFormatException e) {
                return 0; // Domyślna wartość w przypadku błędu
            }
    }

}