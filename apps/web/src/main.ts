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
  const home = Home(() => askPermissions());
  mount(home);
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
