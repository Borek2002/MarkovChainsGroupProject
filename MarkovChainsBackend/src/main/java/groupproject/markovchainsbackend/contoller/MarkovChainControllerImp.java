package groupproject.markovchainsbackend.contoller;

import groupproject.markovchainsbackend.dto.MarkovRequest;
import groupproject.markovchainsbackend.service.MarkovChainService;
import org.apache.commons.math3.linear.Array2DRowRealMatrix;
import org.apache.commons.math3.linear.ArrayRealVector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MarkovChainControllerImp implements MarkovChainController {

    private final MarkovChainService markovChainService;

    @Autowired
    public MarkovChainControllerImp(MarkovChainService markovChainService) {
        this.markovChainService = markovChainService;
    }

    @Override
    public double[] getProbabilityVectorAfterNSteps(@RequestParam(name = "steps") int n) {
        return this.markovChainService.calculateProbabilityVectorAfterNSteps(n);
    }

    @Override
    public double[] getStationaryDistributions() {
        return this.markovChainService.calculateStationaryDistribution();
    }

    @Override
    public double[] getFinalProbability() {
        return this.markovChainService.calculateFinalProbability();
    }

    @Override
    public int getImmersiveState() {
        return this.markovChainService.getImmersiveState();
    }

    @Override
    public MarkovRequest getMatrixAndVector() {
        return this.markovChainService.getMatrixAndVector();
    }

    @Override
    public ResponseEntity<Void> setMatrixAndVector(@RequestBody MarkovRequest request){
        this.markovChainService.setMatrixAndVector(request);
        return ResponseEntity.noContent().build();
    }


}
