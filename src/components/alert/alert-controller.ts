import { action, observable, reaction, when } from 'mobx'

export interface AlertConfig {
  title?: string
  message?: string
  ok?: string
  persistent?: boolean
  callback?: (ok: boolean) => void
}

export class AlertController {
  @observable show = false
  @observable config: AlertConfig = {}

  constructor() {
    //
  }

  @action.bound changeShow(value: boolean) {
    this.show = value
  }

  @action info(title: string, message: string, ok = 'OK') {
    this.config = { title, message: message ? message : 'Chưa có thông tin', ok, persistent: false }
    this.show = true
  }

  @action confirm(title: string, message: string, ok = 'Xác nhận'): Promise<boolean> {
    this.config = { title, message, ok, persistent: true }
    this.show = true
    return new Promise(resolve => {
      this.config.callback = ok => {
        resolve(ok)
      }
    })
  }

  confirmDelete(type: string): Promise<boolean> {
    return this.confirm('Xác nhận xóa', `Bạn có CHẮC CHẮN muốn xóa ${type} này? Bạn sẽ không thể hoàn tác thao tác.`)
  }

  @action.bound ok() {
    this.show = false
    this.config.callback && this.config.callback(true)
  }

  @action.bound cancel() {
    this.show = false
    this.config.callback && this.config.callback(false)
  }
}

export const alertController = new AlertController()
