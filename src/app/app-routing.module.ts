import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ChatComponent} from './chat/chat.component';

const routes: Routes = [   //<router-outlet> en app.component.html renderiza las rutas
  {path: '',redirectTo:'chat', pathMatch: 'full'}, //para que por defecto redirija a chat
  {path: 'chat', component: ChatComponent} //componente normalgit
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports:[RouterModule]
})

export  class AppRoutingModule {

}
