export interface SocialLinks {
  name: string;
  url: string;
  handle: string;
  icon: string;
  isExternal: boolean;
}

export const SOCIAL_DATA = {
  github: {
    name: 'GitHub',
    url: 'https://github.com/MrTBK',
    handle: '@MrTBK',
    icon: 'github'
  },
  linkedin: {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/mohamed-aziz-tabakh-7b4674234',
    handle: 'mohamed-aziz-tabakh',
    icon: 'linkedin'
  },
  email: {
    name: 'Email',
    url: 'mailto:mohamedaziz.tabakh@esen.tn',
    handle: 'mohamedaziz.tabakh@esen.tn',
    icon: 'mail'
  },
  phone: {
    name: 'Phone / WhatsApp',
    url: 'tel:+21656597139',
    handle: '+216 56 597 139',
    icon: 'phone'
  },
  location: {
    name: 'Location',
    value: 'Tunis, Tunisia',
    icon: 'map-pin'
  },
  resume: {
    name: 'Download CV',
    url: '/resume.pdf',
    fileName: 'Mohamed_Aziz_Tabakh_CV.pdf'
  }
};
