const { User } = require('../models')
const middleware = require('../middleware')

const Register = async (req, res) => {
  try {
    const { email, password, username } = req.body
    console.log(`PW==> ${password}`)
    let passwordDigest = await middleware.hashPassword(password)
    console.log(`PWDigest==> ${passwordDigest}`)
    const user = await User.create({ email, password: passwordDigest, username })
    console.log(`USER==> ${user}`)
    res.send(user)
  } catch (error) {
    throw error
  }
}


const Login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
      raw: true
    })
    if (
      user && middleware.comparePassword(user.passwordDigest, req.body.password)
    ) {
      let payload = {
        id: user.id,
        email: user.email
      }
      let token = middleware.createToken(payload)
      return res.send({ user: payload, token })
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    throw error
  }
}

module.exports = {
  Register,
  Login
}