import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CriticasharePageRoutingModule } from './criticashare-routing.module';

import { CriticasharePage } from './criticashare.page';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CriticasharePageRoutingModule,
    TimeAgoPipe
  ],
  declarations: [CriticasharePage]
})
export class CriticasharePageModule {}
