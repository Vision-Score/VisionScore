import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { CompararJogadores } from './app/components/comparar-jogadores/comparar-jogadores';

bootstrapApplication(CompararJogadores, {
  providers: [provideHttpClient()]
}).catch((err) => console.error(err));
