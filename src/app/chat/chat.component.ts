import { Component, OnInit } from '@angular/core';
import {Client} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private client: Client; //con esto nos conectamos, nos subscribimos a los eventos, etc.. trabajamos con el chat
  conectado: boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.client = new Client();
    this.client.webSocketFactory = ()=>{
      return new SockJS("http://localhost:8080/chat-websocket"); //URL de conexion que configuramos en Java Spring
    }

    //Con esto estamos escuchando cuando queramos conectarnos (pero aun no estamos conectados)
    this.client.onConnect = (frame) => {
      console.log('Conectados: ' + this.client.connected + ' : ' + frame);
      this.conectado = true;
    }

    this.client.onDisconnect = (frame) => {
      console.log('Desconectados: ' + this.client.connected + ' : ' + frame);
      this.conectado = false;
    }

  }
//Con este metodo activated() sí que nos conectamos
conectar():void{
    this.client.activate();
}

  desconectar():void{
    this.client.deactivate();
  }

}
