from math import pi

from DrawingEdge import *
from svggen.utils.utils import prefix as prefixString


class Drawing:
  def __init__(self):
    """
    Initializes an empty dictionary to contain Edge instances.

    Keys will be Edge labels as strings. Key values will be Edge instances.
    """
    self.edges = {}

  def fromGraph(self, g):
    for e in g.edges:
      if e.pts2D is None:
        pass
        #print "No coordinates for edge: " + e.name
      else:
        if len(e.faces) == 1:
          edge = Cut()
        elif len(e.faces) == 2:
          angles = e.faces.values()
          if angles[0][1]:
            angle = angles[0][0] - angles[1][0]
          else:
            angle = angles[1][0] - angles[0][0]
          if angle == 0:
            edge = Flat()
          else:
            edge = Fold(angle=angle)
        else:
          print "Don't know how to handle edge with %d faces" % len(e.faces)
          edge = None
        self.edges[e.name] = Edge(e.name, e.pts2D[0], e.pts2D[1], edge)
    for f in g.faces:
      for e in f.get2DDecorations():
        self.edges[e[0]] = Edge(e[0], e[1], e[2], EdgeType(e[3]))

  def toDXF(self, filename, labels=False, mode="dxf"):
    from dxfwrite import DXFEngine as dxf
    '''
    if mode == "silhouette":
      self.append(Rectangle(12*25.4, 12*25.4, edgetype=Reg()), "outline")
    '''

    dwg = dxf.drawing(filename)
    for e in self.edges.items():
      e[1].toDrawing(dwg, e[0] if labels else "", mode=mode, engine=dxf)
    dwg.save()

    '''
    if mode == "silhouette":
      self.edges.pop("outline.e0")
      self.edges.pop("outline.e1")
      self.edges.pop("outline.e2")
      self.edges.pop("outline.e3")
    '''

  def toSVG(self, filename, labels=False, mode=None):
    """
    Writes all Edge instances to a SVG file.

    @type svg:
    @param svg:
    @type label: tuple
    @param label: location of point two in the form (x2,y2).
    @type mode:
    @param mode:
    """
    import svgwrite

    svg = svgwrite.Drawing(filename)
    for e in self.edges.items():
      e[1].toDrawing(svg, e[0] if labels else "", mode)
    svg.save()

  def points(self):
    """
    @return: a non-redundant list of all endpoints in tuples
    """
    points = []
    for e in self.edges.itervalues():
      coords = e.coords()
      p1 = tuple(coords[0])
      p2 = tuple(coords[1])
      points.append(p1)
      points.append(p2)
    return list(set(points))

  def edgeCoords(self):
    """
    @return: a list of all Edge instance endpoints in Drawing (can include redundant points and edges)
    """
    edges = []
    for e in self.edges.items():
      edges.append(e[1].coords())
    return edges

  def renameedge(self, fromname, toname):
    """
    Renames an Edge instance's Key

    @param fromname: string of the original Edge instance name
    @param toname: string of the new Edge instance name
    """
    self.edges[toname] = self.edges.pop(fromname)
    self.edges[toname].name = toname

    return self

  def invertEdges(self):
    """
    Swaps the mountain/valley folds on all Edge instances of Drawing
    @return: Drawing with the new Edge instances.
    """
    for e in self.edges.values():
      e.invert()
    return self

  def transform(self, scale=1, angle=0, origin=(0,0), relative=None):
    """
    Scales, rotates, and translates the Edge instances in Drawing

    @type scale: float
    @param scale: scaling factor
    @type angle: float
    @param angle: angle to rotate in radians
    @type origin: tuple
    @param origin: origin
    @return: Drawing with the new Edge instances.
    """
    if relative is not None:
      pts = [x[0] for x in self.edgeCoords()] + [x[1] for x in self.edgeCoords()]
      xs = [x[0] for x in pts]
      ys = [x[1] for x in pts]
      minx = min(xs)
      maxx = max(xs)
      miny = min(ys)
      maxy = max(ys)
      midx = minx + relative[0]*(maxx + minx)
      midy = miny + relative[1]*(maxy + miny)
      origin=(origin[0] - midx, origin[1] - midy)

    for e in self.edges.values():
      e.transform(scale=scale, angle=angle, origin=origin)

    return self

  def mirrorY(self):
    """
    Changes the coordinates of Edge instances in Drawing so that they are symmetric about the X axis.
    @return: Drawing with the new Edge instances.
    """
    for e in self.edges.values():
      e.mirrorY()
    return self

  def mirrorX(self):
    """
    Changes the coordinates of Edge instances in Drawing so that they are symmetric about the Y axis.
    @return: Drawing with the new Edge instances.
    """
    for e in self.edges.values():
      e.mirrorX()
    return self

  def flip(self):
    """
    Flips the directionality of Edge instances om Drawing around.
    @return: Drawing with the new Edge instances.
    """
    for e in self.edges.values():
      e.flip()
    return self

  def append(self, dwg, prefix = '', noGraph=False, **kwargs):
    for e in dwg.edges.items():
      self.edges[prefixString(prefix, e[0])] = e[1].copy()
      self.edges[prefixString(prefix, e[0])].transform(**kwargs)
    return self

  def duplicate(self, prefix = ''):
    #Creates a duplicate copy of self.
    c = Drawing()
    for e in self.edges.items():
      c.edges[prefixString(prefix, e[0])] = e[1].copy()
    return c

  def attach(self, label1, dwg, label2, prefix, edgetype, useOrigName = False):
    # XXX TODO(mehtank): check to see if attachment edges match?
    # XXX TOTO(mehtank): make prefix optional?

    if isinstance(label1, (list, tuple)):
      l1 = label1[0]
    else:
      l1 = label1
      label1 = [label1]

    if isinstance(label2, (list, tuple)):
      l2 = label2[0]
    else:
      l2 = label2
      label2 = [label2]

    if isinstance(edgetype, (list, tuple)):
      e12 = edgetype[0]
    else:
      e12 = edgetype
      edgetype = [edgetype] * len(label1)

    #create a copy of the new drawing to be attached
    d = dwg.duplicate()

    #move the edge of the new drawing to be attached to the origin
    d.transform(origin=(-d.edges[l2].x2, -d.edges[l2].y2))

    #don't rescale
    scale = 1

    #find angle to rotate new drawing to align with old drawing edge
    phi   = self.edges[l1].angle()
    angle = phi - d.edges[l2].angle() + pi

    #align edges offset by a separation of distance between the start points
    d.transform(scale=scale, angle=angle, origin=(self.edges[l1].coords()[0][0], self.edges[l1].coords()[0][1]))

    for e in d.edges.items():
      try:
        i = label2.index(e[0])
        e[1].edgetype = edgetype[i]
        if useOrigName:
          e[1].name = label1[label2.index(e[0])]
          self.edges[label1[label2.index(e[0])]] = e[1]
        else:
          self.edges.pop(label1[label2.index(e[0])])
          e[1].name = prefix + '.' + e[0]
          self.edges[prefix + '.' + e[0]] = e[1]
      except ValueError:
        e[1].name = prefix + '.' + e[0]
        self.edges[prefix + '.' + e[0]] = e[1]

  def times(self, n, fromedge, toedge, label, mode):
    d = Drawing()
    d.append(self, label+'0')
    for i in range(1, n):
      d.attach(label+repr(i-1)+'.'+toedge, self, fromedge, label+repr(i), mode)
    return d

class Face(Drawing):
  def __init__(self, pts, edgetype = None, origin = True):
    Drawing.__init__(self)
    if origin:
      pts = list(pts) + [(0,0)]
    else:
      pts = list(pts)

    lastpt = pts[-1]
    edgenum = 0
    edgenames = []
    for pt in pts:
      name = 'e%d' % edgenum
      self.edges[name] = Edge(name, lastpt, pt, edgetype)
      edgenames.append(name)
      lastpt = pt
      edgenum += 1

class Rectangle(Face):
  def __init__(self, l, w, edgetype = None, origin = True):
    Face.__init__(self, ((l, 0), (l, w), (0, w), (0,0)), edgetype, origin)
