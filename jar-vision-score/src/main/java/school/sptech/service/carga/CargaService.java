package school.sptech.service.carga;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CargaService {

    @Autowired CampeaoCargaService campeaoCargaService;
    @Autowired DesempenhoEquipeCargaService desempenhoEquipeCargaService;
    @Autowired DesempenhoJogadorCargaService desempenhoJogadorCargaService;
    @Autowired EquipeCargaService equipeCargaService;
    @Autowired EventoCargaService eventoCargaService;
    @Autowired JogadorCargaService jogadorCargaService;
    @Autowired JogoCargaService jogoCargaService;
    @Autowired LigaCargaService ligaCargaService;
    @Autowired PartidaCargaService partidaCargaService;
    @Autowired SerieCargaService serieCargaService;
    @Autowired TorneioCargaService torneioCargaService;
    @Autowired TreinadorCargaService treinadorCargaService;

    public void executarTodasAsCargas() {
        campeaoCargaService.executar("", "");
        desempenhoEquipeCargaService.executar("", "");
        desempenhoJogadorCargaService.executar("", "");
        equipeCargaService.executar("", "");
        eventoCargaService.executar("", "");
        jogadorCargaService.executar("", "");
        jogoCargaService.executar("", "");
        ligaCargaService.executar("", "");
        partidaCargaService.executar("", "");
        serieCargaService.executar("", "");
        torneioCargaService.executar("", "");
        treinadorCargaService.executar("", "");
    }
}
