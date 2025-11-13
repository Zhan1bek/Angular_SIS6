export interface Launch {
  launchpad: any;
  rocket: any;
  id: string;
  name: string;
  date_utc: string;
  success?: boolean;
  details?: string;
  links: {
    flickr: any;
    patch: {
      small?: string;
      large?: string
    };
    webcast?: string;
    article?: string;
  };
}
