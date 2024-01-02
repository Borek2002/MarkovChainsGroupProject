package groupproject.markovchainsbackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarkovRequest {
    private double[][] transitionMatrix;
    private double[] initialVector;
}
