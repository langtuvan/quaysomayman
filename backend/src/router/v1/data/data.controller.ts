import { Controller, Get } from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { SubCategoryService } from '../subCategory/subCategory.service';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceModel } from 'src/type/ConfigService';
import { PageService } from '../page/page.service';

@Controller()
export class DataController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly subCategoryService: SubCategoryService,
    private readonly pageService: PageService,
    //private readonly configService: ConfigService<ConfigServiceModel>,
  ) {}

  mainLayout = {
    header: {
      navItems: [
        // { label: 'Trang Chủ', url: '/' },
        // {
        //   label: 'May mắn',
        //   url: '/fortune',
        //   children: [
        //     { label: 'Sổ xố may mắn', url: 'random' },
        //     { label: 'Vòng quay may mắn', url: 'wheel' },
        //   ],
        // },
        // { label: 'Resume', url: '/resume' },
      ],
    },
    footer: {
      copyRight:
        '© 2025 Design by langtuvan@hotmail.com , based on Tailwind CSS UI, Catalyst UI , Next.js',
      navigation: {
        solutions: [
          { name: 'Marketing', href: '#' },
          { name: 'Analytics', href: '#' },
          { name: 'Automation', href: '#' },
          { name: 'Commerce', href: '#' },
          { name: 'Insights', href: '#' },
        ],
        support: [
          { name: 'Submit ticket', href: '#' },
          { name: 'Documentation', href: '#' },
          { name: 'Guides', href: '#' },
        ],
        company: [
          { name: 'About', href: '#' },
          { name: 'Blog', href: '#' },
          { name: 'Jobs', href: '#' },
          { name: 'Press', href: '#' },
        ],
        legal: [
          { name: 'Terms of service', href: '#' },
          { name: 'Privacy policy', href: '#' },
          { name: 'License', href: '#' },
        ],
      },
    },
    GoogleTagManagerId: 'GTM-W56DZCZC',
    GoogleAnalyticsId: 'G-70Y7VD1MWX', // 'G-XXXXXXXXXX',
  };

  // dashboardPages = [
  //   { label: 'Home', url: '/dashboard' },
  //   { label: 'Pages', url: '/dashboard/pages' },
  // ];

  DashboardLayout = {
    navItems: [
      {
        icon: 'HomeIcon',
        label: 'Home',
        url: '/dashboard',
      },
      {
        icon: 'ArrowPathIcon',
        label: 'Document',
        url: '/dashboard/document/list',
      },
    ],
  };

  @Get('mainLayout')
  async getMainLayout() {
    const categories = await this.categoryService.find({ isMenu: true });
    const subCategories = await this.subCategoryService.find({ isMenu: true });

    let response = this.mainLayout;
    response.header.navItems = [
      ...categories.map((cat) => {
        const children = subCategories
          .filter(
            (subCat) => subCat.category._id.toString() === cat._id.toString(),
          )
          .map((subCat) => ({
            label: subCat.displayName,
            url: `${cat.slug}${subCat.slug}`,
          }));
        if (children.length > 0) {
          return {
            label: cat.displayName,
            url: cat.slug,
            children,
          };
        }
        return {
          label: cat.displayName,
          url: cat.slug,
        };
      }),
    ];

    return response;
  }

  @Get('dashboardLayout')
  getDashboarLayout() {
    return { ...this.DashboardLayout };
  }

  // @Get('/dashboard/revalidatePages')
  // getRevalidatePages() {
  //   return {
  //     //mainPages: this.mainPages,
  //     dashboardPages: this.dashboardPages,
  //   };
  // }
}
