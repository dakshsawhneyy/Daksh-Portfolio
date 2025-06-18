import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

// DevOps logos (you can add your own or use these CDNs)
const techLogos = [
  // MERN stack
  { name: 'MongoDB', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'React', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Node.js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },

  // DevOps & Cloud
  { name: 'Docker', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Kubernetes', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
  { name: 'AWS', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
  { name: 'GitHub Actions', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  { name: 'Prometheus', url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Prometheus_software_logo.svg' },
  { name: 'Terraform', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg' },
  { name: 'Helm', url: 'https://helm.sh/img/helm.svg' },
  { name: 'Ansible', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg' },
  { name: 'Jenkins', url: 'https://www.jenkins.io/images/logos/jenkins/jenkins.svg' },
  { name: 'Nginx', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg' },
  { name: 'Linux', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
  { name: 'Postman', url: 'https://cdn.worldvectorlogo.com/logos/postman.svg' },
];

const Techwheel = () => {
  return (
    <div className='py-12'>
        <Swiper slidesPerView={4} spaceBetween={30} loop={true}  autoplay={{ delay: 1000, disableOnInteraction: false }} modules={[Autoplay]} breakpoints={{ 640: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 6 }}} >
            {
                techLogos.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div className='flex justify-center items-center'>
                            <img src={item.url} alt={item.name} className='h-16 w-auto grayscale hover:grayscale-0 transition duration-300 ease-in-out' />
                        </div>
                    </SwiperSlide>
                ))
            }
        </Swiper>
    </div>
  )
}

export default Techwheel