import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product:any = null
  qty:number = 1;

  constructor(
    private route:ActivatedRoute, 
    private apiService: ApiService,
    private cartService: CartService
  ){

  }

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      const id:string = data['id'];
      this.apiService.getSingleProduct(id).subscribe((data:any) => {
        this.product = data.product;
      })
    })
  }

  decreaseQty(){
    if(this.qty == 1)
      return
    this.qty = this.qty - 1;
  }

  increaseQty(){
    if (this.qty == this.product.stock){
      return
    }
    this.qty = this.qty + 1;
  }

  addToCart(){
    const newCartItem = {
      product: this.product,
      qty: this.qty
    }

    if(this.product.stock == 0){
      return;
    }

    //Add cart item
    this.cartService.addItem(newCartItem)
  }
}
