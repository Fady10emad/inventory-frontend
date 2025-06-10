import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { appRoutes } from './shared/routers/appRouters';
import { authGuard } from './core/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: appRoutes.items.base,
    pathMatch: 'full',
  },
  {
    path: '',
    component: ContentLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('@modules/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'about',
        loadChildren: () => import('@modules/about/about.module').then((m) => m.AboutModule),
      },
      {
        path: 'contact',
        loadChildren: () => import('@modules/contact/contact.module').then((m) => m.ContactModule),
      },
      {
        path: appRoutes.categories.base,
        loadChildren: () =>
          import('@modules/categories-groups/categories-groups.module').then(
            (m) => m.CategoriesGroupsModule
          ),
      },
      {
        path: appRoutes.items.base,
        loadChildren: () => import('@modules/items/items.module').then((m) => m.ItemsModule),
      },
      {
        path: appRoutes.store.base,
        loadChildren: () => import('@modules/store/store.module').then((m) => m.StoreModule),
      },
      {
        path: appRoutes.vendor.base,
        loadChildren: () => import('@modules/vendors/vendors.module').then((m) => m.VendorsModule),
      },
      {
        path: appRoutes.priceList.base,
        loadChildren: () =>
          import('@modules/price-list-grid/price-list-grid.module').then(
            (m) => m.PriceListGridModule
          ),
      },
      {
        path: appRoutes.dismissalNotice.base,
        loadChildren: () =>
          import('@modules/dismissal-notice/dismissal-notice.module').then(
            (m) => m.DismissalNoticeModule
          ),
      },
      {
        path: appRoutes.purchasesInvoice.base,
        loadChildren: () =>
          import('@modules/purchases-invoices/purchases-invoices.module').then(
            (m) => m.PurchasesInvoicesModule
          ),
      },
      {
        path: appRoutes.stockItemsRequisition.base,
        loadChildren: () =>
          import('@modules/stock-items-requisition/stock-items-requisition.module').then(
            (m) => m.StockItemsRequisitionModule
          ),
      },
    ],
  },
  {
    path: appRoutes.auth.base,
    component: AuthLayoutComponent,
    loadChildren: () => import('@modules/auth/auth.module').then((m) => m.AuthModule),
  },
  { path: '**', redirectTo: '/dashboard/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
