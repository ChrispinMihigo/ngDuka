import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Product } from '../../../core/models/product.models';
import { ApiService } from '../../../core/service/api.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  loading = signal(true);
  products?: Product[];
  api = inject(ApiService);
  sectionTitle = input.required<string>();
  query = input.required<string>();
  queryLimitCount = input<number>();
  productsSubs?: Subscription;
  private router = inject(Router);
  private title = inject(Title);

  ngOnInit(): void {
    const products$ =
      this.query() === 'allProducts'
        ? this.api.getProducts()
        : this.api.getProductsByCategory(this.query(), this.queryLimitCount());
    this.productsSubs = products$.subscribe((products) => {
      this.products = products;
      if (this.router.url.includes('products')) {
        this.title.setTitle(`${products[0].category} - ngDuka`);
      }
      this.loading.set(false);
    });
  }

  ngOnDestroy(): void {
    this.productsSubs?.unsubscribe();
  }
}
