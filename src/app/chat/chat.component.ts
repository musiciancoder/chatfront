import { Component, OnInit } from '@angular/core';
import {Client} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {Mensaje} from './models/mensaje';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private client: Client; //con esto nos conectamos, nos subscribimos a los eventos, etc.. trabajamos con el chat
  conectado: boolean = false;
  mensaje: Mensaje = new Mensaje();
  mensajes: Mensaje[] =[];

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

      //TODO preguntar si this.client es un Observable
      this.client.subscribe('/chat/mensaje', evento=>{ //este es el evento cuando alguien escribe algun mensaje en el chat lo escuchemos
        let mensaje : Mensaje = JSON.parse(evento.body) as Mensaje; //recibimos un evento.body que es un json string, lo estamos pasando a javascript object y luego a mensaje
        mensaje.fecha = new Date (mensaje.fecha); // mensaje.fecha long que viene del backend
        this.mensajes.push(mensaje);
        console.log(mensaje);
      })
      this.mensaje.tipo = 'NUEVO_USUARIO';
      this.client.publish({destination: '/app/mensaje/', body:JSON.stringify(this.mensaje)});
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

  //cuando el usuario envía un mensaje
  enviarMensaje(): void{
    this.mensaje.tipo = 'MENSAJE';
    this.client.publish({destination: '/app/mensaje/', body:JSON.stringify(this.mensaje)});
    this.mensaje.texto = '';
  }

}
