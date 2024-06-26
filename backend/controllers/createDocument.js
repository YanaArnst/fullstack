import Order from "../models/OrderModel.js";
import Tool from "../models/ToolModel.js";
import Client from "../models/ClientModel.js";
import User from "../models/UserModel.js";
import officegen from "officegen";


export function createDocument (order) {
    const docx = officegen('docx');
    

   // Добавляем параграфы с текстом
   const p1 = docx.createP();
   p1.addText('                                                                   ДОГОВОР ПРОКАТА', { bold: true }); 
   p1.addText(''); // Пустая строка для разделения абзацев
 
   const p2 = docx.createP();
   p2.addText('город Зеленодольск, РТ');

   const date = new Date(order.dateIssue);
   const formattedDate = date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
 
   const p3 = docx.createP();
   p3.addText(formattedDate, { underline: true });

 
   const p4 = docx.createP();
   p4.addText('ИП АВВАКУМОВ Д.С., именуемый в дальнейшем «Арендодатель», с одной стороны, и ');
   p4.addText(`${order.client.surname || ''} ${order.client.name || ''} ${order.client.patronomic || ''}`, { underline: true });
   p4.addText(', именуемый(ая) в дальнейшем «Арендатор», с другой стороны, заключили настоящий договор о нижеследующем:');

  const p5 = docx.createP();
  p5.addText('                                                                   1. ПРЕДМЕТ ДОГОВОРА', { bold: true });
  
  const p6 = docx.createP();
  p6.addText('1.1. По условиям настоящего Договора Арендодатель предоставляет Арендатору во временное пользование за плату (методом самообслуживания) движимое имущество: инструменты, машины, приспособления, спортивное оборудование, тренажеры и прочий инвентарь, именуемое в дальнейшем «Имущество»:');
  
  const p7 = docx.createP();
  p7.addText('Наименование: ')
  p7.addText(`${order.tool.name || ''}`, { underline: true });
  

  const p8 = docx.createP();
  p8.addText('Срок проката, сутки: ')
  p8.addText(`${order.amountDay || ''}`, { underline: true });

  const p9 = docx.createP();
  p9.addText('Стоимость проката, руб./сутки: ')
  p9.addText(`${order.costPerDay || ''}`, { underline: true });


  const p11 = docx.createP();
  p11.addText('1.2. Имущество может быть использовано Арендатором по своему усмотрению, с учетом его индивидуальных характеристик по назначению. На момент подписания настоящего Договора все характеристики Имущества Арендатору известны и в дальнейшем Арендатор не может ссылаться на отсутствие его неосведомленности. ')

  const p12 = docx.createP();
  p12.addText('1.3. Имущество передается Арендатору и возвращается Арендодателю по акту приема-передачи по месту нахождения склада пункта проката Арендодателя: РТ г. ЗЕЛЕНОДОЛЬСК, ул. ТАТАРСТАН, д. 42')

  const p13 = docx.createP();
  p13.addText('                                                                   2. АРЕНДНАЯ ПЛАТА. ДЕНЕЖНЫЙ ЗАЛОГ', { bold: true });

  const p14 = docx.createP();
  p14.addText('2.1. Оплата стоимости арендной платы в размере 100% осуществляется в момент передачи Имущества Арендодателем Арендатору наличными денежными средствами, либо иным способом передачи денежных средств.')

  const p15 = docx.createP();
  p15.addText('2.2. При продлении срока проката Имущества, Арендатор обязуется внести 100% предоплату за следующий период проката Имущества из расчета стоимости проката за сутки, в момент подписания дополнительного соглашения о продлении срока проката, но не позднее одного календарного дня.')

  const p16 = docx.createP();
  p16.addText('2.3. В случае досрочного возврата Имущества, Арендатору возвращается сумма за неиспользуемое время проката, исчисляя ее со дня, следующего за днем фактического возврата Имущества.')

  const p17 = docx.createP();
  p17.addText('2.4. В целях обеспечения надлежащего исполнения Арендатором своим обязательств по настоящему Договору, Арендатор предоставляет Арендодателю денежный залог (далее Залог) в размере ')
  p17.addText(`${order.deposit || ''}`, { underline: true });
  p17.addText(' рублей. Залог возвращается Арендатору после возврата Имущества и оплаты всех платежей по данному Договору.')

  const p18 = docx.createP();
  p18.addText('                                                                   3. СРОКИ ИСПОЛНЕНИЯ ОБЯЗАТЕЛЬСТВ', { bold: true });

  const p19 = docx.createP();
  p19.addText('3.1. Настоящий Договор вступает в силу с момента его подписания Сторонами и действует до исполнения сторонами обязательств.')

  const p20 = docx.createP();
  p20.addText('3.2. В случае, если Арендатор желает продлить Договор проката, он должен до окончания срока действия Договора лично обратиться к Арендодателю для продления Договора (заключения дополнительного соглашения). В этом случае Арендодатель оставляет за собой право отказаться от продления Договора и(или) осмотра Имущества.')

  const p21 = docx.createP();
  p21.addText('3.3. В случае задержки Имущества более 2-х часов от времени указанного в акте приема-передачи Имущества, автоматически начисляется полная стоимость проката за следующие сутки.')

  const p22 = docx.createP();
  p22.addText('3.4. В случае невыполнения Арендатором обязательств по данному Договору более 6 календарных дней, Арендодатель вправе передать право требования по настоящему Договору третьим лицам')


  const p23 = docx.createP();
  p23.addText('                                                                   4. ОБЯЗАННОСТИ СТОРОН', { bold: true });

  const p24 = docx.createP();
  p24.addText('4.1. Арендодатель обязан:');
  
  const p25 = docx.createP();
  p25.addText('4.1.1. В присутствии Арендатора проверить исправность Имущества, отсутствие внешних дефектов, наличие контрольных пломб, комплектность.');

  const p26 = docx.createP();
  p26.addText('4.2. Арендатор обязан:');

  const p27 = docx.createP();
  p27.addText('4.2.1. При задержке Имущества более оговоренного срока известить об этом Арендодателя в течение одного календарного дня, продлить настоящий Договор на новый срок и оплатить стоимость проката;');

  const p28 = docx.createP();
  p28.addText('4.2.2. При поломке Имущества известить Арендодателя и сдать Имущество Арендодателю не позднее одних суток с момента поломки для выяснения причин поломки;');

  const p29 = docx.createP();
  p29.addText('4.2.3. Эксплуатировать полученное Имущество в соответствии с правилами его эксплуатации и технических характеристик, а также соблюдать все меры по технике безопасности при его использовании.');

  const p30 = docx.createP();
  p30.addText('4.2.4. Пользоваться Имуществом в соответствии с его целевым назначением;');

  const p31 = docx.createP();
  p31.addText('4.2.5. Нести расходы на содержание Имущества, а также расходы, возникающие с его эксплуатацией (расходуемые материалы, масла и прочее). Следить за целостностью и сохранностью Имущества, не допуская замены деталей;');

  const p32 = docx.createP();
  p32.addText('4.2.6. Вернуть Арендодателю Имущество в первоначальном состоянии.');


  const p33 = docx.createP();
  p33.addText('                                                                   5. ОТВЕТСТВЕННОСТЬ СТОРОН', { bold: true });

  const p34 = docx.createP();
  p34.addText('5.1. В случае невозвращения Арендатором Имущества в установленный настоящим Договором срок, Арендатору начисляется плата согласно п. 2.2 настоящего Договора и штрафная неустойка в размере 5% от стоимости Имущества за каждый день просрочки исполнения обязательств до фактической даты возврата Имущества.');

  const p35 = docx.createP();
  p35.addText('5.2. Все риски, связанные с потерей, утратой, порчей, повреждением или кражей Имущества, независимо от того, исправим или неисправим ущерб, принимает на себя Арендатор. В случае утери или поломки механических повреждений или некомплектности Имущества, Арендатор оплачивает Арендодателю его стоимость.');

  const p36 = docx.createP();
  p36.addText('5.3. Арендодатель вправе досрочно расторгнуть настоящий Договор, если Арендатор использует Имущество не по своему назначению, либо умышленно или по неосторожности ухудшает его качество и потребительские свойства. Арендодатель в любое время может попросить Арендатора представить Имущество для его проверки.');

  const p37 = docx.createP();
  p37.addText('5.4. Арендатор несет все расходы по транспортировке Имущества в адрес Арендодателя;');

  const p38 = docx.createP();
  p38.addText('5.5. Арендодатель не несет ответственности за прямые или косвенные убытки, причиненные Арендатором и (или) третьей стороне за использование Имущества в период передачи его передачи и до возврата.');


  const p39 = docx.createP();
  p39.addText('                                                                   6. ПОРЯДОК РАЗРЕШЕНИЯ СПОРОВ', { bold: true });

  const p40 = docx.createP();
  p40.addText('6.1. Споры, возникающие при исполнении настоящего Договора, разрешаются Сторонами путем переговоров и/или направления претензий. Сторона, получившая претензию, обязана направить уведомление о ее получении в течение 10 дней с момента получения. Ответ по существу должен быть направлен Стороной в течение 10 дней с момента получения претензии.');

  const p41 = docx.createP();
  p41.addText('6.2. В случае невозможности разрешения спора во внесудебном порядке спор подлежит рассмотрению в суде по месту нахождения Арендодателя.');

  const p42 = docx.createP();
  p42.addText('6.3. Настоящий Договор вступает в силу с даты его подписания Сторонами, и действует до исполнения сторонами обязательств. Все приложения к настоящему Договору являются его неотъемлемой частью.');

// Добавляем несколько пустых строк
for (let i = 0; i < 6; i++) {
  const emptyLine = docx.createP();
  emptyLine.addText(' ');
}

  const p43 = docx.createP();
  p43.addText('                   АКТ ПРИЕМА-ПЕРЕДАЧИ ИМУЩЕСТВА В ПРОКАТ к настоящему договору', { bold: true });


  const p44 = docx.createP();
  p44.addText('Арендодатель передал, а Арендатор принял:');
  
  const p45 = docx.createP();
  p45.addText('Наименование: ');
  p45.addText(`${order.tool.name || ''}`, { underline: true });
  
  const p46 = docx.createP();
  p46.addText('Срок проката, сутки: ');
  p46.addText(`${order.amountDay || ''}`, { underline: true });

  const p47 = docx.createP();
  p47.addText('Стоимость проката, руб./сутки: ');
  p47.addText(`${order.costPerDay || ''}`, { underline: true });

  const p48 = docx.createP();
  p48.addText('Общая сумма проката, руб.: ');
  p48.addText(`${order.cost|| ''}`, { underline: true });

  const p50 = docx.createP();
  p50.addText('Примечание   ');
  p50.addText('__________________________________________________________');

  const p51 = docx.createP();
  p51.addText('Арендодатель       ');
  p51.addText('__________________');

  const p52 = docx.createP();
  p52.addText('Арендатор       ');
  p52.addText('       __________________');
  p52.addText('');


  const p53 = docx.createP();
  p53.addText('                   АКТ ПРИЕМА-ПЕРЕДАЧИ ИМУЩЕСТВА ИЗ ПРОКАТА к настоящему договору', { bold: true });


  const p54 = docx.createP();
  p54.addText('Арендатор передал, а Арендодатель принял:');
  
  const p55 = docx.createP();
  p55.addText('Наименование: ');
  p55.addText(`${order.tool.name || ''}`, { underline: true });
  
  const p56 = docx.createP();
  p56.addText('Срок проката, сутки: ');
  p56.addText(`${order.amountDay || ''}`, { underline: true });

  const p57 = docx.createP();
  p57.addText('Стоимость проката, руб./сутки: ');
  p57.addText(`${order.costPerDay || ''}`, { underline: true });

  const p58 = docx.createP();
  p58.addText('Общая сумма проката, руб.: ');
  p58.addText(`${order.cost|| ''}`, { underline: true });

  const p59 = docx.createP();
  p59.addText('Имущество передается в полной исправности и комплектности. Работоспособность Имущества проверена в присутствии Арендатора. Арендодатель ознакомил Арендатора с правилами эксплуатации, хранения, техникой безопасности и назначением Имущества. Претензий со стороны Арендатора не имеется.')

  const p60 = docx.createP();
  p60.addText('Примечание   ');
  p60.addText('__________________________________________________________');

  const p61 = docx.createP();
  p61.addText('Арендодатель       ');
  p61.addText('__________________');

  const p62 = docx.createP();
  p62.addText('Арендатор       ');
  p62.addText('       __________________');


    return docx;
}
