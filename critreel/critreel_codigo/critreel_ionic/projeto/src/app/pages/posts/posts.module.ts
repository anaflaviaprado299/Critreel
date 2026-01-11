import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostsPageRoutingModule } from './posts-routing.module';

import { PostsPage } from './posts.page';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostsPageRoutingModule,
    TimeAgoPipe
  ],
  declarations: [PostsPage]
})
export class PostsPageModule {}
