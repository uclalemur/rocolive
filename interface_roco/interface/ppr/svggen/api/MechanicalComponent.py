from svggen.api.component import Component
import svggen.utils.mymath as np
from svggen.utils.transforms import Roll, Pitch, Yaw, quat2DCM, get6DOF


class MechanicalComponent(Component):
  def define(self, origin=True, euler=None, quat=True, **kwargs):
    Component.define(self, **kwargs)

    if origin:
      x = self.addParameter("dx", 0, dynamic=True)
      y = self.addParameter("dy", 0, dynamic=True)
      z = self.addParameter("dz", 0, dynamic=True)
      origin = [x, y, z]
      self.transform3D = np.Matrix(4, 4, lambda i, j: i == j and 1 or j == 3  and origin[i] or 0)
    else:
      self.transform3D = np.eye(4)

    if euler:
      r = self.addParameter("roll", 0, dynamic=True)
      p = self.addParameter("pitch", 0, dynamic=True)
      y = self.addParameter("yaw", 0, dynamic=True)
      euler = [r, p, y]
      self.transform3D = np.dot(self.transform3D, Yaw(euler[2]))
      self.transform3D = np.dot(self.transform3D, Pitch(euler[1]))
      self.transform3D = np.dot(self.transform3D, Roll(euler[0]))
    elif quat:
      a = self.addParameter("q_a", 1, dynamic=True)
      b = self.addParameter("q_i", 0, dynamic=True)
      c = self.addParameter("q_j", 0, dynamic=True)
      d = self.addParameter("q_k", 0, dynamic=True)
      self.addSemanticConstraint(np.Eq(a*a + b*b + c*c + d*d, 1))
      quat = [a, b, c, d]
      self.transform3D = np.dot(self.transform3D, quat2DCM(quat))

  def get6DOF(self):
    if self.transform3D is not None:
      return get6DOF(self.transform3D)

