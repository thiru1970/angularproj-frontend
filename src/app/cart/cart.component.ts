import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../cart.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems:any = []
  cartCount = 0;
  subTotal = 0;
  estTotal = 0;

  constructor(
    private cartService: CartService, 
    private apiService:ApiService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.cartService.currentItems.subscribe((data:any) => {
      this.cartItems = data;
    })
    this.calculateCartItems()
  }

  deleteItem(product_id:string){
    const prevItem:any = this.cartItems.find((item:any) => item.product._id == product_id)
    if (prevItem){
      const filteredItems = this.cartItems.filter((item:any) => item.product._id !== product_id)
      // this.cartItems = filteredItems;
      this.cartService.updateItems(filteredItems);
    }
    this.calculateCartItems()
  }

  calculateCartItems(){
    this.cartCount = this.cartItems.length;
    this.subTotal = this.cartItems.reduce((acc:any, current:any) => {
     return acc + current.qty;
    },0)
    this.estTotal = this.cartItems.reduce((acc:any, current:any) => {
     return acc + (current.product.price * current.qty);
    },0)
    
  }

    decreaseQty(product_id:string){
      const prevCartItem:any = this.cartItems.find((item:any) => item.product._id == product_id)
      let qty =  prevCartItem.qty;
      if(qty == 1)
        return;
      qty = qty - 1;
      if(prevCartItem) {
        // update item qty
        this.cartItems = this.cartItems.map((item:any) => {
          if (item.product._id == prevCartItem.product._id ) {
            item.qty = qty;
          }
          return item
        })
      }
      this.cartService.updateItems(this.cartItems);
      this.calculateCartItems();
    }

    increaseQty(product_id:string){
      const prevCartItem:any = this.cartItems.find((item:any) => item.product._id == product_id)
      let qty =  prevCartItem.qty;
      if(qty == prevCartItem.product.stock)
        return;
      qty = qty + 1;
      if(prevCartItem) {
        // update item qty
        this.cartItems = this.cartItems.map((item:any) => {
          if (item.product._id == prevCartItem.product._id ) {
            item.qty = qty;
          }
          return item
        })
      }
      this.cartService.updateItems(this.cartItems);
      this.calculateCartItems();
    }

    orderComplete(){
      //api call
      const order = this.cartItems;
      this.apiService.orderCreate(order).subscribe((data:any) => {
        if(data.success == true){
          const orderId = data.order._id;
          //navigation to order success page
          this.router.navigate(['order', 'success',orderId])
          this.cartService.updateItems([]); //clearCart
        }
      })
    }
  }