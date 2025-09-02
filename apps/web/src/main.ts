import './styles.css'
import { Home } from './ui/screens/Home'
import { Permissions } from './ui/screens/Permissions'
import { Game } from './ui/screens/Game'
import { Result } from './ui/screens/Result'

const app = document.getElementById('app')!;

function mount(el: HTMLElement) {
  app.innerHTML = '';
  app.appendChild(el);
}

function startFlow() {
  const home = Home(() => startGameDirect());
  mount(home);
}

async function startGameDirect() {
  try {
    // Solicitar permissão diretamente no clique do botão JOGAR
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    // Fecha imediatamente; o ecrã do jogo reabre a câmara
    stream.getTracks().forEach(t => t.stop());
    mount(Game((score) => mount(Result(score, () => startFlow())), () => startFlow()));
  } catch (e) {
    // Fallback para o ecrã de permissões, caso falhe ou seja negado
    askPermissions();
  }
}

function askPermissions() {
  const perms = Permissions(async () => {
    try {
      // Permissions are requested when Game screen starts the camera
      mount(Game((score) => mount(Result(score, () => startFlow())), () => startFlow()));
    } catch (e) {
      alert('Não foi possível aceder à câmara.');
      startFlow();
    }
  }, () => startFlow());
  mount(perms);
}

startFlow();
