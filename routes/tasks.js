import express from 'express'
import DLL from 'jex-dll'
const router = express.Router()

const data = new DLL()

router.get('/', (_req, res) => {
  res.statusCode = 200
  res.json({
    data: data.nodes,
  })
})

router.post('/', (req, res) => {
  res.statusCode = 200
  const { value } = req.body
  const entity = data.push(value)
  const index = data.nodes.indexOf(entity)
  const triple = [
    data.nodes[index - 1] || null,
    entity,
    data.nodes[index + 1] || null,
  ]
  res.json({
    data: triple,
  })
})

module.exports = router
