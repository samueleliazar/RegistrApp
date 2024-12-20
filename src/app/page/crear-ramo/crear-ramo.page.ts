import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore'; 
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-crear-ramo',
  templateUrl: './crear-ramo.page.html',
  styleUrls: ['./crear-ramo.page.scss'],
})
export class CrearRamoPage implements OnInit {
  nombreramo: string ='';
  sigla: string = '';
  fecha_inicio: string = '';
  fecha_termino: string ='';
  profesorId: string = 'profesor-id-aqui';
  mensajeError: string = '';
  constructor(private navCtrl: NavController, private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }

  goTocrear_ramo() {
    this.navCtrl.navigateForward('/crear-ramo')
  }
  ngOnInit() {
    this.afAuth.onAuthStateChanged((user: firebase.User | null) => {
      if (user) {
        this.profesorId = user.uid;
      }
    });
  }

  crearRamo() {
    this.mensajeError = '';
    if (this.nombreramo && this.sigla && this.fecha_inicio && this.fecha_termino) {
      const fechaInicio = new Date(this.fecha_inicio);
      const fechaTermino = new Date(this.fecha_termino);

      // Validación de fechas
      if (fechaTermino < fechaInicio) {
        this.mensajeError = 'La fecha de término no puede ser anterior a la fecha de inicio.';
        return; // Salir si las fechas no son válidas
      }

      const ramoId = `QR${this.sigla}`.toUpperCase(); 
      const nuevoRamo = {
        nombre: this.nombreramo,
        sigla: this.sigla,
        fecha_inicio: this.fecha_inicio,
        fecha_termino: this.fecha_termino,
        qr_id: ramoId,
      };

      if (this.profesorId) {
        this.firestore.collection('profesores')
          .doc(this.profesorId)
          .collection('ramos')
          .doc(ramoId)
          .set(nuevoRamo)
          .then(() => {
            console.log('Nuevo ramo creado con éxito');
            this.navCtrl.navigateForward('/asignatura-qr');
          })
          .catch((error) => {
            this.mensajeError = 'Error al crear el ramo: ' + error.message;
          });
      } else {
        console.error('No se ha encontrado un usuario autenticado.');
      }
    } else {
      console.log('Por favor, completa todos los campos correctamente.');
    }
  }
}