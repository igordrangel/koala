import { Tabs } from '@/shared/components/tabs';
import { Component } from '@angular/core';
import { Skeleton } from '../../..//shared/components/skeleton/skeleton';
import { Section } from '../../../core/components/section';

@Component({
  selector: 'app-skeleton-page',
  templateUrl: './skeleton.page.html',
  imports: [Section, Tabs, Skeleton],
})
export class SkeletonPage {}
