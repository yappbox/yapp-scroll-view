/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Controller from '@ember/controller';
import { later } from '@ember/runloop';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class extends Controller {
  unloadedStrings = A([
    'H. Next level +1 keytar schlitz cred af. Bitters lumbersexual enamel pin williamsburg meggings lyft tofu jean shorts dreamcatcher taiyaki artisan vice sartorial. Hot chicken vaporware vexillologist polaroid, shoreditch skateboard readymade knausgaard whatever letterpress scenester viral cronut butcher. Kinfolk master cleanse neutra dreamcatcher.',
    'I. Drinking vinegar sartorial kitsch organic, seitan migas kombucha tofu adaptogen crucifix unicorn. Woke palo santo kombucha gochujang DIY man bun. Cred tbh whatever, craft beer mixtape chicharrones selfies microdosing seitan. Tattooed banh mi hella semiotics green juice hammock tbh gastropub YOLO tacos roof party artisan kitsch.',
    "J. Fam bespoke whatever salvia enamel pin church-key humblebrag pinterest. Stumptown four dollar toast crucifix, 90's everyday carry fingerstache iPhone. Poutine stumptown typewriter iceland gastropub. Leggings literally disrupt, skateboard tote bag thundercats mlkshk ennui poke VHS biodiesel tilde portland. Pabst food truck wayfarers mixtape single-origin coffee knausgaard swag wolf. Four dollar toast shabby chic pour-over hella portland, cloud bread try-hard slow-carb shoreditch.",
    'K. Kinfolk helvetica waistcoat, tote bag PBR&B paleo vice shabby chic migas. Fanny pack af deep v biodiesel cornhole chambray freegan gochujang pug whatever stumptown lomo. Try-hard XOXO heirloom, lyft mlkshk vape PBR&B vegan pour-over chillwave meggings ramps poke bitters. Cardigan vegan copper mug pickled man bun, activated charcoal truffaut kinfolk shoreditch ugh letterpress leggings roof party single-origin coffee ennui.',
    'L. Bicycle rights disrupt yr cornhole celiac, mixtape slow-carb retro locavore pork belly lumbersexual squid hot chicken single-origin coffee. Tacos pitchfork pork belly seitan aesthetic. Ethical tousled flannel, letterpress slow-carb shaman tilde kogi lumbersexual next level microdosing kitsch. Chambray wolf air plant fanny pack put a bird on it. Franzen cornhole narwhal artisan lyft, skateboard bicycle rights kitsch tattooed subway tile biodiesel wayfarers. Neutra plaid franzen VHS salvia.',
    'M. Freegan mumblecore man braid poke. Next level VHS pour-over hoodie sartorial forage health goth shoreditch quinoa cronut banh mi locavore everyday carry blog craft beer. Shoreditch kombucha raclette before they sold out copper mug irony truffaut yr, pitchfork fingerstache tumblr quinoa austin taxidermy. Pok pok pitchfork sartorial biodiesel tumblr narwhal. Narwhal cliche schlitz shoreditch vexillologist lumbersexual vape chia salvia forage.',
    "N. Kogi crucifix la croix, 90's blog normcore church-key. Flannel pitchfork kickstarter vegan. Kombucha truffaut pitchfork freegan marfa narwhal, ennui pabst yr whatever franzen neutra street art af. Direct trade portland hella, iPhone tumeric tumblr butcher prism enamel pin cred cray +1 succulents cornhole four loko. Microdosing you probably haven't heard of them synth tacos, heirloom food truck vexillologist tote bag typewriter.",
    'O. Tumeric copper mug ugh poke, activated charcoal squid gochujang franzen. Biodiesel bespoke drinking vinegar aesthetic, offal next level jianbing poutine master cleanse af lumbersexual blue bottle meh crucifix. Echo park af craft beer literally. Bitters woke direct trade activated charcoal quinoa man braid austin truffaut blue bottle chillwave dreamcatcher pug raw denim. Schlitz drinking vinegar hot chicken butcher taxidermy vinyl lomo hexagon tacos. Vegan messenger bag tumeric tote bag quinoa, polaroid succulents tilde yuccie tousled snackwave pug viral.',
    'P. Semiotics meditation man bun bespoke sartorial normcore chicharrones fingerstache four dollar toast helvetica. Sartorial shabby chic pinterest, blue bottle la croix pop-up activated charcoal small batch leggings neutra crucifix before they sold out. +1 banjo wolf bitters, chicharrones hoodie snackwave raclette blue bottle taiyaki tattooed church-key poke. Schlitz occupy hella, street art hashtag trust fund art party. Selvage swag cold-pressed vexillologist next level chia green juice microdosing enamel pin offal succulents selfies kitsch.',
    "Q. Vinyl snackwave DIY kombucha tousled, godard biodiesel tote bag semiotics. You probably haven't heard of them trust fund tacos tofu wolf direct trade 8-bit chillwave farm-to-table small batch vaporware roof party. Church-key banjo meggings live-edge austin ugh portland enamel pin artisan godard lo-fi typewriter shoreditch air plant. Truffaut mixtape austin keytar hell of raclette. Disrupt echo park cornhole direct trade DIY palo santo iceland. 90's quinoa put a bird on it raw denim, bushwick twee chartreuse.",
    'R. Retro pug mixtape hashtag la croix. XOXO asymmetrical street art, cronut taxidermy selvage la croix iceland readymade fingerstache activated charcoal coloring book. Taiyaki messenger bag affogato, af XOXO pour-over selfies flexitarian. Jianbing iceland paleo, coloring book humblebrag hammock cronut enamel pin blog air plant PBR&B 3 wolf moon flannel prism. Shaman keytar direct trade street art. Brooklyn try-hard kinfolk etsy shoreditch affogato fixie.',
    'S. Wolf cred austin, pok pok scenester lyft unicorn cornhole vexillologist everyday carry twee. Truffaut scenester synth aesthetic mustache hashtag biodiesel lomo. Vice man braid authentic kale chips, waistcoat jean shorts knausgaard kombucha. Enamel pin freegan intelligentsia tacos wayfarers chillwave banjo pickled semiotics.',
    "T. Salvia vegan sartorial, williamsburg four loko knausgaard glossier pok pok helvetica lyft. Celiac hashtag twee gluten-free bushwick tumeric actually, hoodie thundercats hexagon tattooed. Jianbing cornhole shoreditch, blog intelligentsia man bun actually pour-over chillwave you probably haven't heard of them synth. Gastropub salvia hell of butcher blue bottle, tumeric tbh vaporware poke wayfarers slow-carb edison bulb vape. Quinoa edison bulb roof party, tacos chicharrones meditation crucifix direct trade flexitarian lumbersexual cardigan organic ramps. Retro tofu direct trade flexitarian craft beer DIY squid trust fund cronut pop-up kale chips flannel.",
  ]);

  loadedStrings = A([
    "A. Lorem ipsum dolor amet yr sustainable yuccie, bespoke hexagon woke brunch iPhone franzen health goth. Pork belly bushwick tumeric authentic. Cred pour-over venmo cardigan seitan fanny pack vaporware asymmetrical keytar beard migas trust fund ethical. Celiac banh mi post-ironic swag vape. Activated charcoal lyft next level mixtape post-ironic 90's. 90's XOXO austin whatever, health goth portland flannel retro air plant kinfolk.",
    'B. Photo booth actually fingerstache, keffiyeh brooklyn lumbersexual fashion axe cred taiyaki tattooed palo santo schlitz flannel. Bitters four loko church-key try-hard, kogi plaid biodiesel. Iceland poke kogi biodiesel, adaptogen sriracha glossier drinking vinegar chia tattooed shabby chic iPhone disrupt cloud bread. Williamsburg schlitz selvage fingerstache flexitarian affogato swag subway tile poke af chillwave pok pok unicorn jean shorts pug. 3 wolf moon tousled dreamcatcher sartorial master cleanse small batch vice tofu taiyaki. Pabst adaptogen sartorial +1 occupy tumblr jean shorts pop-up yr edison bulb tumeric next level.',
    'C. Pour-over wolf +1 selvage kombucha, salvia dreamcatcher iPhone umami whatever chia banjo four dollar toast. Yr vexillologist occupy, godard lyft typewriter cornhole. Waistcoat cornhole taxidermy, keytar post-ironic prism food truck banh mi 8-bit air plant mixtape distillery blue bottle. Semiotics flannel truffaut, seitan twee air plant offal snackwave tattooed banjo small batch microdosing cloud bread. Neutra pabst sartorial, PBR&B tattooed synth letterpress four dollar toast disrupt meditation waistcoat vice vexillologist.',
    "D. Vexillologist everyday carry taxidermy mixtape, health goth coloring book ennui tumblr portland farm-to-table paleo plaid viral. Four loko gentrify vaporware hexagon tote bag +1 semiotics bushwick occupy cornhole stumptown swag raw denim venmo you probably haven't heard of them. Try-hard portland coloring book mumblecore everyday carry. Bicycle rights knausgaard taiyaki, organic swag vegan godard PBR&B banjo slow-carb VHS heirloom next level. Knausgaard banh mi iceland marfa tattooed farm-to-table lyft waistcoat austin tumeric. Tumeric cornhole next level, fashion axe fam small batch prism mustache meggings cloud bread cronut twee man bun marfa. Meggings pop-up quinoa, succulents leggings hoodie gluten-free meditation trust fund chartreuse.",
    "E. Four loko live-edge VHS typewriter small batch bespoke pickled marfa listicle 90's photo booth. Whatever crucifix vegan unicorn leggings kinfolk. Food truck roof party scenester fanny pack intelligentsia salvia next level thundercats truffaut. Shaman actually mumblecore chambray meditation hashtag kinfolk four loko austin meggings keffiyeh meh.",
    'F. Portland tote bag XOXO, af organic yuccie chartreuse kogi beard kickstarter. YOLO banjo fingerstache health goth intelligentsia crucifix. Gluten-free kogi roof party iceland tousled cardigan polaroid readymade affogato. Gentrify selvage roof party vice sartorial. +1 wayfarers man braid franzen jean shorts.',
    'G. Plaid shoreditch heirloom authentic bushwick. Small batch XOXO meditation plaid woke tattooed. Vice umami tote bag, YOLO banh mi wolf yr flannel. Knausgaard everyday carry meh, succulents pabst cred literally four loko hoodie fingerstache heirloom. Fam YOLO enamel pin, vinyl vaporware chia sartorial master cleanse iceland.',
  ]);

  get hasMore() {
    return this.unloadedStrings.length > 0;
  }

  @tracked isLoadingMore = false;

  @action
  loadMore() {
    this.isLoadingMore = true;
    later(
      this,
      () => {
        for (var i = 0; i < 5; i++) {
          if (this.unloadedStrings.length > 0) {
            this.loadedStrings.pushObject(this.unloadedStrings.shiftObject());
          }
        }
        this.isLoadingMore = false;
      },
      2000
    );
  }
}
