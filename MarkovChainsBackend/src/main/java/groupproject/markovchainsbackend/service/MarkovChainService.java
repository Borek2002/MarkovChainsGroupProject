package groupproject.markovchainsbackend.service;

import groupproject.markovchainsbackend.markovchain.MarkovChain;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.math3.linear.RealMatrix;
import org.apache.commons.math3.linear.RealVector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Setter
@Getter
public class MarkovChainService {
    private final MarkovChain markovChain;
    private RealVector vector;
    private RealMatrix matrix;

    @Autowired
    public MarkovChainService(MarkovChain markovChain) {
        this.markovChain = markovChain;
    }

    public double[] calculateProbabilityVectorAfterNSteps(int n) {
        RealVector result = this.markovChain.calculateProbabilityVectorAfterNSteps(n);
        return result.toArray();
    }

    public double[] calculateStationaryDistribution() {
        RealVector result = this.markovChain.calculateStationaryDistribution();
        return result.toArray();
    }

    public double[] calculateFinalProbability() {
        RealVector result = this.markovChain.calculateFinalProbabilityVector();
        return result.toArray();
    }

    public int getImmersiveState(){
        return this.markovChain.getImmersiveState();
    }
}
