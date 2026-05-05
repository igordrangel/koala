import { Tabs } from '@/shared/components/tabs';
import { Component } from '@angular/core';
import { Section } from '../../../core/components/section';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-pagination-page',
  templateUrl: './pagination.page.html',
  imports: [Section, Tabs, Pagination],
})
export class PaginationPage {}
