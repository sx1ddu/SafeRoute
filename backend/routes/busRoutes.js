const router=require('express').Router(); const c=require('../controllers/busController'); const {protect,allowRoles}=require('../middleware/authMiddleware');
router.get('/',protect,allowRoles('admin'),c.getAllBuses);
router.get('/mine',protect,allowRoles('driver','parent'),c.getMyBus);
router.post('/register',protect,allowRoles('admin'),c.registerBus);
router.put('/update-status',protect,allowRoles('driver'),c.updateBusStatus);
router.put('/update-location',protect,allowRoles('driver'),c.updateBusLocation);
module.exports=router;
