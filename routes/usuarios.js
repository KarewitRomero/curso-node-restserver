
const { Router } = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const {
        validarCampos, 
        validarJWT, 
        esAdminRole, 
        tieneRole
 } = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        check('rol').custom( esRoleValido ),
        validarCampos
], usuariosPut);

//El segundo es el middleware [], si este pasa entonces se dispara el usuariosPost, de lo contrario ya no prosigue
router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('correo', 'El correo no es válido').isEmail(),
        check('correo').custom( emailExiste ),
        check('password', 'El password es obligatorio y debe contener al más de 6 letras').isLength({ min: 6 }),
        // check('rol', 'No es un rol válido').isIn([ 'ADMIN_ROL', 'USER_ROL' ]),
        check('rol').custom( esRoleValido ),
        validarCampos
], usuariosPost); 

router.delete('/:id', [
        validarJWT,
        // esAdminRole,
        tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);






module.exports = router;
