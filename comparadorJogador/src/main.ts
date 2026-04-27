import { bootstrapApplication } from '@angular/platform-browser';
import { CompararJogadores } from './app/components/comparar-jogadores/comparar-jogadores';

bootstrapApplication(CompararJogadores)
  .catch((err) => console.error(err));
