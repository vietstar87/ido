import _ from 'lodash'

export const fileHelpers = {
  getApiFileUrl: (model: any) => {
    if (typeof model === 'string') {
      return process.env.VUE_APP_API_ENDPOINT + model
    } else if (_.get(model, 'url')) {
      return process.env.VUE_APP_API_ENDPOINT + _.get(model, 'url')
    } else {
      return null
    }
  }
}
