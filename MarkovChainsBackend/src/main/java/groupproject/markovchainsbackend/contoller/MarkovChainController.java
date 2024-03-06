package groupproject.markovchainsbackend.contoller;

import groupproject.markovchainsbackend.dto.MarkovRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface MarkovChainController {

    @GetMapping("/markovchain/probabilityAfterNSteps")
    public double[] getProbabilityVectorAfterNSteps(@RequestParam(name = "steps") int n);

    @GetMapping("/markovchain/stationaryDistribution")
    public double[] getStationaryDistributions();

    @GetMapping("/markovchain/finalProbability")
    public double[] getFinalProbability();

    @GetMapping("/markovchain/immersiveState")
    public int getImmersiveState();

    @PutMapping("/markovchain/matrixAndVector")
    public ResponseEntity<Void> setMatrixAndVector(@RequestBody MarkovRequest request);
}
