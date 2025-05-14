import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';

const AboutPage: React.FC = () => {
  // Animaciones
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-neutral-darkest text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1594732832278-abd644401cd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
            alt="Galería de arte" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div 
            className="max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-5xl font-heading font-bold mb-6">
              Sobre Nosotros
            </h1>
            <p className="text-xl text-neutral-lightest mb-8">
              Galería Virtual es un espacio dedicado a la promoción y difusión del arte contemporáneo, conectando artistas talentosos con amantes del arte en todo el mundo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-heading font-bold mb-6">Nuestra Historia</h2>
              <p className="text-neutral-dark mb-4">
                Fundada en 2020, Galería Virtual nació como respuesta a la necesidad de crear espacios alternativos para la exhibición y venta de arte durante tiempos desafiantes. Lo que comenzó como una iniciativa temporal se ha convertido en una plataforma permanente que trasciende las limitaciones físicas.
              </p>
              <p className="text-neutral-dark mb-4">
                Nuestro equipo está formado por curadores, gestores culturales y especialistas en tecnología que comparten la pasión por democratizar el acceso al arte y brindar nuevas oportunidades a artistas emergentes y establecidos.
              </p>
              <p className="text-neutral-dark">
                A lo largo de estos años, hemos colaborado con más de 100 artistas, organizado exhibiciones virtuales temáticas y facilitado la venta de obras a coleccionistas en diferentes partes del mundo.
              </p>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1577720580479-7d839d829c73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80" 
                alt="Nuestra Historia" 
                className="w-full h-auto rounded-lg shadow-elevated"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nuestra Misión */}
      <section className="py-16 bg-neutral-lightest">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-heading font-bold mb-6">Nuestra Misión</h2>
              <p className="text-neutral-dark mb-4">
                En Galería Virtual, nuestra misión es democratizar el acceso al arte y crear conexiones significativas entre artistas y amantes del arte. Creemos que el arte debe ser accesible para todos, independientemente de su ubicación geográfica o circunstancias.
              </p>
              <p className="text-neutral-dark mb-4">
                Buscamos:
              </p>
              <ul className="list-disc list-inside text-neutral-dark mb-4 space-y-2">
                <li>Promover la obra de artistas talentosos, ofreciéndoles una plataforma para mostrar su trabajo a una audiencia global.</li>
                <li>Facilitar la adquisición de arte original, haciendo que el proceso sea transparente y accesible.</li>
                <li>Educar e inspirar a nuevas generaciones de amantes del arte a través de contenido informativo y exhibiciones virtuales temáticas.</li>
                <li>Fomentar la innovación en la intersección del arte y la tecnología.</li>
              </ul>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1580974852861-c381510bc98e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80" 
                alt="Nuestra Misión" 
                className="w-full h-auto rounded-lg shadow-elevated"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nuestro Equipo */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-heading font-bold mb-4">Nuestro Equipo</h2>
            <p className="text-neutral-dark max-w-2xl mx-auto">
              Contamos con un equipo diverso de profesionales apasionados por el arte y la tecnología, unidos por el propósito de crear nuevas posibilidades para artistas y coleccionistas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Miembro 1 */}
            <motion.div 
              className="bg-white rounded-lg shadow-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                alt="Ana Rodríguez" 
                className="w-full h-64 object-cover object-top"
              />
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold mb-1">Ana Rodríguez</h3>
                <p className="text-primary mb-4">Directora y Curadora</p>
                <p className="text-neutral-dark">
                  Con más de 15 años de experiencia en gestión cultural y curaduría, Ana ha colaborado con importantes galerías y museos a nivel internacional.
                </p>
              </div>
            </motion.div>

            {/* Miembro 2 */}
            <motion.div 
              className="bg-white rounded-lg shadow-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80" 
                alt="Carlos Mendoza" 
                className="w-full h-64 object-cover object-top"
              />
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold mb-1">Carlos Mendoza</h3>
                <p className="text-primary mb-4">Director Tecnológico</p>
                <p className="text-neutral-dark">
                  Ingeniero y entusiasta del arte digital, Carlos lidera el desarrollo tecnológico de nuestra plataforma, buscando constantemente innovar en la experiencia de usuario.
                </p>
              </div>
            </motion.div>

            {/* Miembro 3 */}
            <motion.div 
              className="bg-white rounded-lg shadow-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80" 
                alt="Luisa Martínez" 
                className="w-full h-64 object-cover object-top"
              />
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold mb-1">Luisa Martínez</h3>
                <p className="text-primary mb-4">Coordinadora de Artistas</p>
                <p className="text-neutral-dark">
                  Historiadora del arte y gestora cultural, Luisa se encarga de la selección y relación con los artistas, asegurando una curaduría diversa y de calidad.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-heading font-bold mb-4">
              Forma parte de nuestra comunidad
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Explora nuestra galería, conecta con artistas y encuentra obras que te inspiren. El arte está al alcance de un clic.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/galeria">
                <Button 
                  variant="outline" 
                  className="text-white border-white hover:bg-white hover:text-primary"
                  size="lg"
                >
                  Explorar galería
                </Button>
              </Link>
              <Link to="/contacto">
                <Button 
                  variant="secondary"
                  size="lg"
                >
                  Contáctanos
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;