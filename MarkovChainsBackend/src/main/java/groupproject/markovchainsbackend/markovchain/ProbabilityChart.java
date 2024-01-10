package groupproject.markovchainsbackend.markovchain;

import org.apache.commons.math3.linear.RealMatrix;
import org.apache.commons.math3.linear.RealVector;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.plot.XYPlot;
import org.jfree.data.category.CategoryDataset;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.xy.XYSeries;
import org.jfree.data.xy.XYSeriesCollection;
import javax.swing.*;
import java.awt.*;

public class ProbabilityChart extends JFrame {
    private MarkovChain markovChain;

    public ProbabilityChart(MarkovChain markovChain) {
        super("Probability Chart");
        this.markovChain = markovChain;

        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        XYSeriesCollection dataset = createDataset(this.markovChain.getSteps());
        JFreeChart chart = createChart(dataset);

        ChartPanel chartPanel = new ChartPanel(chart);
        chartPanel.setPreferredSize(new Dimension(560, 370));
        setContentPane(chartPanel);
    }

    private XYSeriesCollection createDataset(int steps) {
        XYSeriesCollection dataset = new XYSeriesCollection();

        int maxSteps = 10;  // Maksymalna liczba kroków do wygenerowania wykresu
        int dimension = markovChain.getTransitionMatrix().getRowDimension();

        for (int step = 0; step <= steps; step++) {
            RealVector result = markovChain.calculateProbabilityVectorAfterNSteps(step);
            XYSeries series = new XYSeries("Step " + step);

            for (int state = 0; state < dimension; state++) {
                series.add(state, result.getEntry(state));
            }

            dataset.addSeries(series);
        }

        return dataset;
    }

    private JFreeChart createChart(XYSeriesCollection dataset) {
        JFreeChart chart = ChartFactory.createBarChart(
                "Probability Distribution After N Steps",
                "States",
                "Probability",
                createCategoryDataset(dataset),
                PlotOrientation.VERTICAL,
                true, true, false
        );

        return chart;
    }

    private CategoryDataset createCategoryDataset(XYSeriesCollection dataset) {
        DefaultCategoryDataset categoryDataset = new DefaultCategoryDataset();

        for (int i = 0; i < dataset.getSeriesCount(); i++) {
            XYSeries series = dataset.getSeries(i);
            for (int j = 0; j < series.getItemCount(); j++) {
                categoryDataset.addValue(series.getY(j).doubleValue(), series.getKey(), Integer.toString(series.getX(j).intValue()));
            }
        }
        return categoryDataset;
    }

}
