import { CenteredLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';

function AboutContent() {
  return (
    <>
      <p>
        <strong>TREAD Talks</strong> was originally created as a way to bookmark and track the many
        sermons I was listening to. Often, I would listen while walking on a treadmill or taking a
        walk outside—hence the name.
      </p>

      <p>
        Over time, as I shared what I was learning with others, some wanted to listen for
        themselves. This project has since proven to be a valuable tool for finding, referencing,
        and sharing the sermons I have consumed. My hope is that it will also serve as a helpful
        resource or starting point for others seeking to strengthen their spiritual heartbeat while
        working out their physical one.
      </p>

      <p>
        Additionally, I built the site to satisfy a web development itch, combining content I love
        with technology I was learning to use. Learning to develop has always worked best for me
        through real-world projects. In that process, I aimed to build the site in the most
        cost-effective way possible, which presented a unique but rewarding challenge. To this day,
        the domain name remains the only cost beyond my time—time I give with great joy.
      </p>

      <p>
        Finally, Philippians 3:17 calls us to keep our eyes on those who walk according to godly
        example. We are to join them and imitate their faithfulness, humility, and ongoing pursuit
        of Christ. We live in a time with unprecedented access to some of the greatest preachers and
        teachers, both past and present.
      </p>

      <p>
        These sermons should never compete with or replace our devotion to the local church or the
        pastors who care for and tend to our souls (Hebrews 13:17). The ultimate goal is to be
        strengthened and equipped through the hearing of God’s Word, so that we may walk as children
        of light, to the praise and glory of God.
      </p>
    </>
  );
}

export default function AboutPage() {
  return <CenteredLayout content={<AboutContent />} header={<PageHeader title="About" />} />;
}
