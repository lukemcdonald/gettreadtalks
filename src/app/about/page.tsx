import { MainLayout } from '@/components/layouts/main-layout';
import { PageHeader } from '@/components/page-header';

export default function AboutPage() {
  return (
    <MainLayout>
      <PageHeader title="About" />

      <div className="mt-6 space-y-6">
        <p>
          TREAD Talks was initially created as a way to bookmark and track the many sermons I was
          listening to. Often times, I would listen to sermons while walking on the the treadmill or
          on a walk outside, hence the name.
        </p>

        <p>
          Over time, as I would tell others about what I was learning, some would want to listen for
          themselves. This project has since proved to be a useful tool for me to find, reference,
          and share many of the sermons I have consumed. My hope is that it would also serve as a
          useful tool or starting point for others seeking to elevate their spiritual heartbeat
          while working out their physical one.
        </p>

        <p>
          Additionally, I built the site to scratch a web development itch using content I love with
          technology I was learning to use. Learning to develop has always worked best for me with
          real-world projects. In doing so, I wanted to create the site in the most cost effective
          way possible. This created a unique but rewarding challenge. To this day, the domain name
          is the only cost outside of my time, which I do with great joy.
        </p>

        <p>
          Finally, Philippians 3:17 tells us to keep our eyes on those who walk according by
          example. We are to join them and imitate them in their faithfulness, humility, and the
          ongoing pursuit of obtaining Christ. We live in a time where we have access to some of the
          great preachers and teachers of our time and time past.
        </p>

        <p>
          These sermons should never compete with or replace our devotion to the local church and
          the pastors who care for and tend to our souls (Hebrews 13:17). Ultimately, the goal is to
          be strengthened and equipped by the hearing of God&apos;s word so that we may walk as
          children of Light to the praise and glory of God.
        </p>
      </div>
    </MainLayout>
  );
}
