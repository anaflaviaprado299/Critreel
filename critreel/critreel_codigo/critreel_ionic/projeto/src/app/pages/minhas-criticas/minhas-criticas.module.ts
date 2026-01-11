import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MinhasCriticasPageRoutingModule } from './minhas-criticas-routing.module';

import { MinhasCriticasPage } from './minhas-criticas.page';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MinhasCriticasPageRoutingModule,
    TimeAgoPipe
  ],
  declarations: [MinhasCriticasPage]
})
export class MinhasCriticasPageModule {}
