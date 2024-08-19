import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, services } from '@adonisjs/drive'

const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK'),

  /**
   * The services object can be used to configure multiple file system
   * services each using the same or a different driver.
   */
  services: {
    ingredients: services.fs({
      location: app.publicPath('./images/ingredients'),
      serveFiles: true,
      routeBasePath: '/images/ingredients',
      visibility: 'public',
    }),
    cocktails: services.fs({
      location: app.publicPath('./images/cocktails'),
      serveFiles: true,
      routeBasePath: '/images/cocktails',
      visibility: 'public',
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
