import { MenuItemType } from '@paljs/ui/types';

const items: MenuItemType[] = [
  {
    title: 'Dashboard',
    icon: { name: 'home' },
    link: { href: '/dashboard' },
  },
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Administración',
    children: [
      {
        title: 'Alianzas',
        link: { href: '/administration/partners' },
      }
    ]
  },
  {
    title: 'Catálogos',
    children: [
      {
        title: 'Localización',
        link: { href: '/catalogues/locale' },
      },
      {
        title: 'Tipo de Servicio',
        link: { href: '/catalogues/serviceType' },
      },
      {
        title: 'Iconos',
        link: { href: '/catalogues/icons' },
      },
      {
        title: 'Incluye',
        link: { href: '/catalogues/includes' },
      },
      {
        title: 'Recomendaciones',
        link: { href: '/catalogues/recommendations' },
      }
    ]
  },
  {
    title: 'Tours',
    children: [
      {
        title: 'Tipo',
        link: { href: '/tours/tourType' },
      },
      {
        title: 'Categoria',
        link: { href: '/tours/tourCategory' },
      }
    ]
  },
  {
    title: 'Transportación',
    children: [
      {
        title: 'Tipo',
        link: { href: '/transportation/transportationType' },
      },
      {
        title: 'Servicio Abierto',
        link: { href: '/transportation/bookingOpenService' },
      }
    ]
  },
  {
    title: 'Renta de Autos',
    children: [
      {
        title: 'Tipo',
        link: { href: '/carRental/carRentalType' },
      },
      {
        title: 'Marcas',
        link: { href: '/carRental/carBrand' },
      },
      {
        title: 'Transmisión',
        link: { href: '/carRental/carEngine' },
      },
      {
        title: 'Locaciones',
        link: { href: '/carRental/carRentalLocations' },
      }
    ]
  },
  {
    title: 'Extra Components',
    icon: { name: 'star-outline' },
    children: [
      {
        title: 'Accordion',
        link: { href: '/extra-components/accordion' },
      },
      {
        title: 'Actions',
        link: { href: '/extra-components/actions' },
      },
      {
        title: 'Alert',
        link: { href: '/extra-components/alert' },
      },
      {
        title: 'List',
        link: { href: '/extra-components/list' },
      },
      {
        title: 'Spinner',
        link: { href: '/extra-components/spinner' },
      },
      {
        title: 'Progress Bar',
        link: { href: '/extra-components/progress' },
      },
      {
        title: 'Tabs',
        link: { href: '/extra-components/tabs' },
      },
      {
        title: 'Chat',
        link: { href: '/extra-components/chat' },
      },
      {
        title: 'Cards',
        link: { href: '/extra-components/cards' },
      },
      {
        title: 'Flip Card',
        link: { href: '/extra-components/flip-card' },
      },
      {
        title: 'Reveal Card',
        link: { href: '/extra-components/reveal-card' },
      },
    ],
  },
  {
    title: 'Forms',
    icon: { name: 'edit-2-outline' },
    children: [
      {
        title: 'Inputs',
        link: { href: '/forms/inputs' },
      },
      {
        title: 'Layout',
        link: { href: '/forms/form-layout' },
      },
      {
        title: 'Buttons',
        link: { href: '/forms/buttons' },
      },
      {
        title: 'Select',
        link: { href: '/forms/select' },
      },
    ],
  },
  {
    title: 'UI Features',
    icon: { name: 'keypad-outline' },
    children: [
      {
        title: 'Grid',
        link: { href: '/ui-features/grid' },
      },
      {
        title: 'Animated Searches',
        link: { href: '/ui-features/search' },
      },
    ],
  },
  {
    title: 'Modal & Overlays',
    icon: { name: 'browser-outline' },
    children: [
      {
        title: 'Popover',
        link: { href: '/modal-overlays/popover' },
      },
      {
        title: 'Tooltip',
        link: { href: '/modal-overlays/tooltip' },
      },
      {
        title: 'Toastr',
        link: { href: '/modal-overlays/toastr' },
      },
    ],
  },
  {
    title: 'Editors',
    icon: { name: 'text-outline' },
    children: [
      {
        title: 'TinyMCE',
        link: { href: '/editors/tinymce' },
      },
      {
        title: 'CKEditor',
        link: { href: '/editors/ckeditor' },
      },
    ],
  },
  {
    title: 'Miscellaneous',
    icon: { name: 'shuffle-2-outline' },
    children: [
      {
        title: '404',
        link: { href: '/miscellaneous/404' },
      },
    ],
  },
  {
    title: 'Auth',
    icon: { name: 'lock-outline' },
    children: [
      {
        title: 'Login',
        link: { href: '/auth/login' },
      },
      {
        title: 'Register',
        link: { href: '/auth/register' },
      },
      {
        title: 'Request Password',
        link: { href: '/auth/request-password' },
      },
      {
        title: 'Reset Password',
        link: { href: '/auth/reset-password' },
      },
    ],
  },
];

export default items;
