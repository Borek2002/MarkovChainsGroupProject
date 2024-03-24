package groupproject.markovchainsbackend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MarkovRequest {
    private double[][] transitionMatrix;
    private double[] initialVector;
}
