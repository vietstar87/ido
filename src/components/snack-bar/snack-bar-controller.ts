import { action, observable } from 'mobx'
import _ from 'lodash'

export interface SnakBarConfig {
  icon?: string
  message?: string
  color?: string
  timeout?: number
}

export class SnackBarController {
  @observable config: SnakBarConfig = {
    timeout: 5000
  }
  @observable show = false

  @action commonError(err: any) {
    let message = 'Đã có lỗi xảy ra, vui lòng thử lại!'
    // strapi error
    const apiError = _.get(err, 'response.data.message')
    console.error(apiError, err)
    if (apiError) {
      if (apiError instanceof Array) {
        let errMsg = _.first(apiError)
        if (errMsg) errMsg = errMsg.messages
        if (errMsg) errMsg = _.first(errMsg)
        if (errMsg) errMsg = errMsg.message
        if (errMsg) message = errMsg
      } else if (apiError instanceof String) {
        message = apiError as string
      }
    }
    this.error(message)
  }

  @action success(message: string) {
    this.config = {
      icon: 'check_circle',
      message,
      color: 'success',
      timeout: 4000
    }
    this.show = true
  }

  @action addSuccess() {
    this.success('Thêm mới thành công')
  }

  @action updateSuccess() {
    this.success('Lưu thành công')
  }

  @action deleteSuccess() {
    this.success('Xóa thành công')
  }

  @action error(message: string) {
    this.config = {
      icon: 'error',
      message,
      color: 'error',
      timeout: 5000
    }
    this.show = true
  }

  @action close() {
    this.show = false
  }
}

export const snackController = new SnackBarController()
