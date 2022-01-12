import { Injectable } from '@angular/core';
import { ToastController,LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class LoadingService {

	constructor(
		public loadingCtrl: LoadingController,
		public toastCtrl: ToastController,
		public alertController: AlertController
	){

	}

	async open() {
		let loading = await this.loadingCtrl.create({
			message:'Please wait',
			mode:'ios',
    	});
    	await loading.present();
	}

	async close() {
		await this.loadingCtrl.dismiss()
	}

	async message(message) {
		const toast = await this.toastCtrl.create({
			message: message,
			duration: 2000,
			position: 'top',
			color:'dark'
		});
		toast.present();
	}

	async presentAlert(title,message) {
		const alert = await this.alertController.create({
			cssClass: 'alert',
			header: title,
			message: message,
			buttons: ['OKAY']
		});
		await alert.present();
  	}
}
