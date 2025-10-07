import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  loadStripe,
  Stripe,
  StripeCardElement,
  StripeElements,
} from '@stripe/stripe-js';
import { Api } from '../../service/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../../util/Constants';

@Component({
  selector: 'app-payment-component',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payment-component.html',
  styleUrl: './payment-component.css',
})
export class PaymentComponent {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;

  clientSecret: any = null; //unique transaction id
  error: any = null;
  processing: boolean = false;

  bookingReference: string | null = null;
  amount: number | null = null;

  constructor(
    private apiService: Api,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.bookingReference =
      this.route.snapshot.paramMap.get('bookingReference');
    this.amount = parseFloat(this.route.snapshot.paramMap.get('amount') || '0');

    this.stripe = await loadStripe(Constants.STRIPE_KEY);

    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.cardElement = this.elements.create('card');
      this.cardElement.mount('#card-element');
    }

    this.fetchClientSecrete();
  }

  fetchClientSecrete(): void {
    const paymentData = {
      bookingReference: this.bookingReference,
      amount: this.amount,
    };
  }
}
