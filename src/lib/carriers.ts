// src/lib/carriers.ts
// Carrier helpers — mirrors channels.ts pattern exactly.
// Fetches from Postgres Carrier table (seeded from Voila API); falls back to
// hardcoded data so the UI works even when the DB is not yet connected.
//
// Keys match the Voila API courier key field (e.g. "RoyalMail", "DPD", "Evri").
// Logo URLs are direct Voila CDN paths — the same URLs the seed script stores.

export interface CarrierData {
  key: string
  displayName: string
  logoUrl: string | null
}

const VOILA_CDN = 'https://app.heyvoila.io/courier-service-logos'

// Full list of 181 carriers from Voila API — keyed by Voila carrier key.
// DB data takes priority; these are the fallbacks for when the DB is unavailable.
export const CARRIER_FALLBACKS: Record<string, CarrierData> = {
  'AGL':                          { key: 'AGL',                          displayName: 'Agile Global Logistics',           logoUrl: `${VOILA_CDN}/AGL-Logo.png` },
  'AIT':                          { key: 'AIT',                          displayName: 'AIT',                              logoUrl: `${VOILA_CDN}/ait.jpg` },
  'AJPCouriers':                  { key: 'AJPCouriers',                  displayName: 'AJP Couriers',                     logoUrl: `${VOILA_CDN}/ajpcouriers.jpg` },
  'AKMGlobal':                    { key: 'AKMGlobal',                    displayName: 'AKM Global',                       logoUrl: `${VOILA_CDN}/akm.jpg` },
  'AKMGlobalSolutions':           { key: 'AKMGlobalSolutions',           displayName: 'AKM Global Solutions',            logoUrl: `${VOILA_CDN}/akm.jpg` },
  'AltLogic':                     { key: 'AltLogic',                     displayName: 'AltLogic',                         logoUrl: `${VOILA_CDN}/altlogic.jpg` },
  'Amazon':                       { key: 'Amazon',                       displayName: 'Amazon',                           logoUrl: `${VOILA_CDN}/amazon.jpg` },
  'AmazonEasyShip':               { key: 'AmazonEasyShip',               displayName: 'Amazon Easy Ship',                logoUrl: `${VOILA_CDN}/amazon-shipping.jpg` },
  'AmazonShippingCentral':        { key: 'AmazonShippingCentral',        displayName: 'Amazon Shipping Central',         logoUrl: `${VOILA_CDN}/amazon-shipping.jpg` },
  'AmazonFrance':                 { key: 'AmazonFrance',                 displayName: 'Amazon Shipping France',          logoUrl: `${VOILA_CDN}/amazon-shipping.jpg` },
  'AmazonItaly':                  { key: 'AmazonItaly',                  displayName: 'Amazon Shipping Italy',           logoUrl: `${VOILA_CDN}/amazon-shipping.jpg` },
  'AmazonSpain':                  { key: 'AmazonSpain',                  displayName: 'Amazon Shipping Spain',           logoUrl: `${VOILA_CDN}/amazon-shipping.jpg` },
  'AnPost':                       { key: 'AnPost',                       displayName: 'An Post',                          logoUrl: `${VOILA_CDN}/an-post.jpg` },
  'APC':                          { key: 'APC',                          displayName: 'APC',                              logoUrl: `${VOILA_CDN}/apc.jpg` },
  'APGGlobal':                    { key: 'APGGlobal',                    displayName: 'APG Global',                       logoUrl: `${VOILA_CDN}/apgglobal.jpg` },
  'ArrowXL':                      { key: 'ArrowXL',                      displayName: 'Arrow XL',                         logoUrl: `${VOILA_CDN}/arrowxl.jpg` },
  'Asendia':                      { key: 'Asendia',                      displayName: 'Asendia',                          logoUrl: `${VOILA_CDN}/asendia.jpg` },
  'B2CEurope':                    { key: 'B2CEurope',                    displayName: 'B2C Europe',                       logoUrl: `${VOILA_CDN}/b2c.jpg` },
  'BarcodeLogistics':             { key: 'BarcodeLogistics',             displayName: 'Barcode Logistics',               logoUrl: `${VOILA_CDN}/barcodelogistics.jpg` },
  'BirdSystem':                   { key: 'BirdSystem',                   displayName: 'Bird System',                      logoUrl: `${VOILA_CDN}/bird-system.jpg` },
  'BJS':                          { key: 'BJS',                          displayName: 'BJS Home Delivery',               logoUrl: `${VOILA_CDN}/bjshomedelivery.jpg` },
  'BoxedoffBarcodes':             { key: 'BoxedoffBarcodes',             displayName: 'Boxedoff Barcodes',               logoUrl: `${VOILA_CDN}/boxedoff.jpg` },
  'BulletExpress':                { key: 'BulletExpress',                displayName: 'Bullet Express',                  logoUrl: `${VOILA_CDN}/bullet-express.jpeg` },
  'Caribou':                      { key: 'Caribou',                      displayName: 'Caribou',                          logoUrl: `${VOILA_CDN}/caribou.jpg` },
  'Chronopost':                   { key: 'Chronopost',                   displayName: 'Chronopost',                       logoUrl: `${VOILA_CDN}/chronopost.jpg` },
  'CitySprint':                   { key: 'CitySprint',                   displayName: 'CitySprint',                       logoUrl: `${VOILA_CDN}/citysprint.jpg` },
  'ColisPriveFR':                 { key: 'ColisPriveFR',                 displayName: 'Colis Prive',                      logoUrl: `${VOILA_CDN}/colisprive.png` },
  'Coll8':                        { key: 'Coll8',                        displayName: 'Coll8 Logistics',                  logoUrl: `${VOILA_CDN}/coll8.jpg` },
  'CollectPlus':                  { key: 'CollectPlus',                  displayName: 'Collect Plus',                     logoUrl: `${VOILA_CDN}/collectplus.jpg` },
  'Correos':                      { key: 'Correos',                      displayName: 'Correos',                          logoUrl: `${VOILA_CDN}/correos.jpg` },
  'CRTransport':                  { key: 'CRTransport',                  displayName: 'CR Transport',                     logoUrl: `${VOILA_CDN}/cr-transport.jpg` },
  'CSM':                          { key: 'CSM',                          displayName: 'CSM',                              logoUrl: `${VOILA_CDN}/csm.jpg` },
  'Dachser':                      { key: 'Dachser',                      displayName: 'Dachser',                          logoUrl: `${VOILA_CDN}/dachser.jpg` },
  'DaiPost':                      { key: 'DaiPost',                      displayName: 'DaiPost',                          logoUrl: `${VOILA_CDN}/daipost.jpg` },
  'Deliver360':                   { key: 'Deliver360',                   displayName: 'Deliver 360',                      logoUrl: `${VOILA_CDN}/deliver-360.jpg` },
  'Deliver365':                   { key: 'Deliver365',                   displayName: 'Deliver 365',                      logoUrl: `${VOILA_CDN}/deliver365.jpg` },
  'Delnext':                      { key: 'Delnext',                      displayName: 'Delnext',                          logoUrl: `${VOILA_CDN}/delnext.jpg` },
  'DeutschePost':                 { key: 'DeutschePost',                 displayName: 'Deutsche Post',                    logoUrl: `${VOILA_CDN}/deutschepost.jpg` },
  'DHLeCommerce':                 { key: 'DHLeCommerce',                 displayName: 'DHL eCommerce',                    logoUrl: `${VOILA_CDN}/dhl-ecommerce.jpg` },
  'DHL':                          { key: 'DHL',                          displayName: 'DHL Express',                      logoUrl: `${VOILA_CDN}/dhl.jpg` },
  'DHLParcelDE':                  { key: 'DHLParcelDE',                  displayName: 'DHL Parcel Germany',               logoUrl: `${VOILA_CDN}/dhl-parcel.jpg` },
  'DHLParcelNL':                  { key: 'DHLParcelNL',                  displayName: 'DHL Parcel Netherlands',           logoUrl: `${VOILA_CDN}/dhl-parcel.jpg` },
  'DHLParcelSpain':               { key: 'DHLParcelSpain',               displayName: 'DHL Parcel Spain',                 logoUrl: `${VOILA_CDN}/dhl-parcel.jpg` },
  'DHLParcelUK':                  { key: 'DHLParcelUK',                  displayName: 'DHL Parcel UK',                    logoUrl: `${VOILA_CDN}/dhl-parcel.jpg` },
  'DHLPoland':                    { key: 'DHLPoland',                    displayName: 'DHL Poland',                       logoUrl: `${VOILA_CDN}/dhl-parcel.jpg` },
  'DHLWarenpost':                 { key: 'DHLWarenpost',                 displayName: 'DHL Warenpost',                    logoUrl: `${VOILA_CDN}/dhl-warren.jpg` },
  'DHLParcelUKCloud':             { key: 'DHLParcelUKCloud',             displayName: 'DHL Parcel UK Cloud',              logoUrl: `${VOILA_CDN}/dhl-parcel.jpg` },
  'DPD':                          { key: 'DPD',                          displayName: 'DPD',                              logoUrl: `${VOILA_CDN}/dpd.jpg` },
  'DPDAustria':                   { key: 'DPDAustria',                   displayName: 'DPD Austria',                      logoUrl: `${VOILA_CDN}/dpd-austria.jpg` },
  'DPDC2C':                       { key: 'DPDC2C',                       displayName: 'DPD C2C',                          logoUrl: `${VOILA_CDN}/dpd.jpg` },
  'DPDGermany':                   { key: 'DPDGermany',                   displayName: 'DPD Germany',                      logoUrl: `${VOILA_CDN}/dpd.jpg` },
  'DPDIreland':                   { key: 'DPDIreland',                   displayName: 'DPD Ireland',                      logoUrl: `${VOILA_CDN}/dpd-ireland.jpg` },
  'DPDLocal':                     { key: 'DPDLocal',                     displayName: 'DPD Local',                        logoUrl: `${VOILA_CDN}/dpdlocal.jpg` },
  'DPDNL':                        { key: 'DPDNL',                        displayName: 'DPD Netherlands',                  logoUrl: `${VOILA_CDN}/dpd-nl.jpg` },
  'DttDeliveriesLtd':             { key: 'DttDeliveriesLtd',             displayName: 'Dtt Deliveries Ltd',               logoUrl: `${VOILA_CDN}/dtt.jpg` },
  'Dunelm':                       { key: 'Dunelm',                       displayName: 'Dunelm',                           logoUrl: `${VOILA_CDN}/dunelm.jpg` },
  'DX':                           { key: 'DX',                           displayName: 'DX',                               logoUrl: `${VOILA_CDN}/dx.jpg` },
  'DxExpress':                    { key: 'DxExpress',                    displayName: 'Dx Express',                       logoUrl: `${VOILA_CDN}/dx-express.jpg` },
  'DxFreight':                    { key: 'DxFreight',                    displayName: 'Dx Freight',                       logoUrl: `${VOILA_CDN}/dx-freight.jpg` },
  'Envialia':                     { key: 'Envialia',                     displayName: 'Envialia',                         logoUrl: `${VOILA_CDN}/envialia.jpg` },
  'ETADistribution':              { key: 'ETADistribution',              displayName: 'ETA Distribution',                logoUrl: `${VOILA_CDN}/eta.jpg` },
  'Evri':                         { key: 'Evri',                         displayName: 'Evri',                             logoUrl: `${VOILA_CDN}/evri.jpg` },
  'EvriCorporate':                { key: 'EvriCorporate',                displayName: 'Evri Corporate',                  logoUrl: `${VOILA_CDN}/evri.jpg` },
  'EvriInternational':            { key: 'EvriInternational',            displayName: 'Evri International',              logoUrl: `${VOILA_CDN}/evri.jpg` },
  'Exelot':                       { key: 'Exelot',                       displayName: 'Exelot',                           logoUrl: `${VOILA_CDN}/exelot.jpg` },
  'Exfreight':                    { key: 'Exfreight',                    displayName: 'ExFreight',                        logoUrl: `${VOILA_CDN}/exfreight.jpg` },
  'ExpectDistribution':           { key: 'ExpectDistribution',           displayName: 'Expect Distribution',             logoUrl: `${VOILA_CDN}/expect.jpg` },
  'ExpressLogistics':             { key: 'ExpressLogistics',             displayName: 'Express Logistics',               logoUrl: `${VOILA_CDN}/expresslogistics.jpg` },
  'FastDespatchLogistics':        { key: 'FastDespatchLogistics',        displayName: 'Fast Despatch Logistics',         logoUrl: `${VOILA_CDN}/fastdespatchlogistics.jpg` },
  'Fastway':                      { key: 'Fastway',                      displayName: 'Fastway',                          logoUrl: `${VOILA_CDN}/fastway.jpg` },
  'Fedex':                        { key: 'Fedex',                        displayName: 'FedEx',                            logoUrl: `${VOILA_CDN}/fedex.png` },
  'P2P':                          { key: 'P2P',                          displayName: 'FedEx Cross Border',              logoUrl: `${VOILA_CDN}/fedex.png` },
  'FedexV2':                      { key: 'FedexV2',                      displayName: 'FedExV2',                          logoUrl: `${VOILA_CDN}/fedex.png` },
  'FloStream':                    { key: 'FloStream',                    displayName: 'FloStream',                        logoUrl: `${VOILA_CDN}/flostream.jpg` },
  'Fosseway':                     { key: 'Fosseway',                     displayName: 'Fosseway',                         logoUrl: `${VOILA_CDN}/fosseway.jpg` },
  'Furdeco':                      { key: 'Furdeco',                      displayName: 'Furdeco',                          logoUrl: `${VOILA_CDN}/furdeco.jpg` },
  'GFS':                          { key: 'GFS',                          displayName: 'GFS Deliver',                      logoUrl: `${VOILA_CDN}/gfs.jpg` },
  'GlobalCorporateLogisticsLtd':  { key: 'GlobalCorporateLogisticsLtd',  displayName: 'Global Corporate Logistics Ltd',  logoUrl: `${VOILA_CDN}/globalcorporatelogistics.jpg` },
  'GlobalE':                      { key: 'GlobalE',                      displayName: 'GlobalE',                          logoUrl: `${VOILA_CDN}/global-e.jpg` },
  'GLSFR':                        { key: 'GLSFR',                        displayName: 'GLS France',                       logoUrl: `${VOILA_CDN}/gls.jpg` },
  'GLSDE':                        { key: 'GLSDE',                        displayName: 'GLS Germany',                      logoUrl: `${VOILA_CDN}/gls.jpg` },
  'GLSIE':                        { key: 'GLSIE',                        displayName: 'GLS Ireland',                      logoUrl: `${VOILA_CDN}/gls.jpg` },
  'GLSNL':                        { key: 'GLSNL',                        displayName: 'GLS Netherlands',                  logoUrl: `${VOILA_CDN}/gls.jpg` },
  'GLSPL':                        { key: 'GLSPL',                        displayName: 'GLS Poland',                       logoUrl: `${VOILA_CDN}/gls-pl.jpg` },
  'GLSES':                        { key: 'GLSES',                        displayName: 'GLS Spain',                        logoUrl: `${VOILA_CDN}/gls.jpg` },
  'HanciaLtd':                    { key: 'HanciaLtd',                    displayName: 'Hancia Ltd',                       logoUrl: `${VOILA_CDN}/hancia.jpg` },
  'Hermes':                       { key: 'Hermes',                       displayName: 'Hermes',                           logoUrl: `${VOILA_CDN}/hermes.jpg` },
  'HermesCorporate':              { key: 'HermesCorporate',              displayName: 'Hermes Corporate',                logoUrl: `${VOILA_CDN}/hermes.jpg` },
  'Hived':                        { key: 'Hived',                        displayName: 'Hived',                            logoUrl: `${VOILA_CDN}/hived.jpg` },
  'HubEurope':                    { key: 'HubEurope',                    displayName: 'HubEurope',                        logoUrl: `${VOILA_CDN}/hubeurope.jpg` },
  'HubEuropeExpress':             { key: 'HubEuropeExpress',             displayName: 'HubEurope Express',               logoUrl: `${VOILA_CDN}/hubeurope.jpg` },
  'HubooShipping':                { key: 'HubooShipping',                displayName: 'Huboo Shipping',                  logoUrl: `${VOILA_CDN}/huboo.jpg` },
  'Huxloe':                       { key: 'Huxloe',                       displayName: 'Huxloe',                           logoUrl: `${VOILA_CDN}/huxloe.jpg` },
  'ImpactExpress':                { key: 'ImpactExpress',                displayName: 'Impact Express',                  logoUrl: `${VOILA_CDN}/impact_express.jpg` },
  'InPost':                       { key: 'InPost',                       displayName: 'InPost',                           logoUrl: `${VOILA_CDN}/InPost.jpg` },
  'InternationalBridgeUSPS':      { key: 'InternationalBridgeUSPS',      displayName: 'International Bridge USPS',       logoUrl: `${VOILA_CDN}/usps.jpg` },
  'InXpressBelfast':              { key: 'InXpressBelfast',              displayName: 'InXpress Belfast',                logoUrl: `${VOILA_CDN}/inxpressbelfast.jpg` },
  'Landmark':                     { key: 'Landmark',                     displayName: 'Landmark',                         logoUrl: `${VOILA_CDN}/landmark.jpg` },
  'Loco':                         { key: 'Loco',                         displayName: 'Loco',                             logoUrl: `${VOILA_CDN}/loco.jpg` },
  'LowCostParcels':               { key: 'LowCostParcels',               displayName: 'Low Cost Parcels',                logoUrl: `${VOILA_CDN}/lowcostparcels.jpg` },
  'MH':                           { key: 'MH',                           displayName: 'MH',                               logoUrl: `${VOILA_CDN}/mh.jpg` },
  'MHI':                          { key: 'MHI',                          displayName: 'MHI',                              logoUrl: `${VOILA_CDN}/mhi.jpg` },
  'MoovParcel':                   { key: 'MoovParcel',                   displayName: 'Moov Parcel',                      logoUrl: `${VOILA_CDN}/moov.jpg` },
  'MushipLimited':                { key: 'MushipLimited',                displayName: 'Muship Limited',                  logoUrl: `${VOILA_CDN}/muship.jpg` },
  'Norsk':                        { key: 'Norsk',                        displayName: 'Norsk',                            logoUrl: `${VOILA_CDN}/norsk.jpg` },
  'NowFulfilment':                { key: 'NowFulfilment',                displayName: 'Now Fulfilment',                  logoUrl: `${VOILA_CDN}/nowfulfilment.jpg` },
  'OnLogistics':                  { key: 'OnLogistics',                  displayName: 'OnLogistics',                      logoUrl: `${VOILA_CDN}/onlogistics.jpg` },
  'OrangeDS':                     { key: 'OrangeDS',                     displayName: 'OrangeDS',                         logoUrl: `${VOILA_CDN}/orangeds.jpg` },
  'Paack':                        { key: 'Paack',                        displayName: 'Paack',                            logoUrl: `${VOILA_CDN}/paack.jpg` },
  'PalletTrack':                  { key: 'PalletTrack',                  displayName: 'Pallet Track',                     logoUrl: `${VOILA_CDN}/pallet_track.jpg` },
  'Palletforce':                  { key: 'Palletforce',                  displayName: 'Palletforce',                      logoUrl: `${VOILA_CDN}/palletforce.jpg` },
  'PalletWays':                   { key: 'PalletWays',                   displayName: 'Palletways',                       logoUrl: `${VOILA_CDN}/palletways.jpg` },
  'Pallex':                       { key: 'Pallex',                       displayName: 'Pallex',                           logoUrl: `${VOILA_CDN}/pallex.jpg` },
  'PallexV2':                     { key: 'PallexV2',                     displayName: 'PallexV2',                         logoUrl: `${VOILA_CDN}/pallex.jpg` },
  'ParcelDeliverySolutionsLtd':   { key: 'ParcelDeliverySolutionsLtd',   displayName: 'Parcel Delivery Solutions Ltd',   logoUrl: `${VOILA_CDN}/parceldeliverysolutionsltd.jpg` },
  'Parcel2Go':                    { key: 'Parcel2Go',                    displayName: 'Parcel2Go',                        logoUrl: `${VOILA_CDN}/parcel2go.jpg` },
  'Parcelforce':                  { key: 'Parcelforce',                  displayName: 'Parcelforce',                      logoUrl: `${VOILA_CDN}/parcelforce.jpg` },
  'ParcelGiantWorldwide':         { key: 'ParcelGiantWorldwide',         displayName: 'ParcelGiantWorldwide',            logoUrl: `${VOILA_CDN}/parcel-giant.jpg` },
  'ParcelHub':                    { key: 'ParcelHub',                    displayName: 'Parcelhub',                        logoUrl: `${VOILA_CDN}/parcelhub.jpg` },
  'Parceltec':                    { key: 'Parceltec',                    displayName: 'Parceltec',                        logoUrl: `${VOILA_CDN}/parceltec.jpg` },
  'PDCLogistics':                 { key: 'PDCLogistics',                 displayName: 'PDC Logistics',                    logoUrl: `${VOILA_CDN}/pdc.jpg` },
  'Polaris':                      { key: 'Polaris',                      displayName: 'Polaris',                          logoUrl: `${VOILA_CDN}/polaris.jpg` },
  'PostNL':                       { key: 'PostNL',                       displayName: 'PostNL',                           logoUrl: `${VOILA_CDN}/postnl.jpg` },
  'PPI':                          { key: 'PPI',                          displayName: 'PPI',                              logoUrl: `${VOILA_CDN}/ppi.jpg` },
  'ProCarrier':                   { key: 'ProCarrier',                   displayName: 'Pro Carrier',                      logoUrl: `${VOILA_CDN}/procarrier.jpg` },
  'PTS':                          { key: 'PTS',                          displayName: 'PTS',                              logoUrl: `${VOILA_CDN}/pts.jpg` },
  'Relay':                        { key: 'Relay',                        displayName: 'Relay',                            logoUrl: `${VOILA_CDN}/relay.jpg` },
  'RMCDistributionUK':            { key: 'RMCDistributionUK',            displayName: 'RMC Distribution UK',             logoUrl: `${VOILA_CDN}/rmc.jpg` },
  'RoyalMail':                    { key: 'RoyalMail',                    displayName: 'Royal Mail',                       logoUrl: `${VOILA_CDN}/royalmail.jpg` },
  'RoyalMailClickAndDrop':        { key: 'RoyalMailClickAndDrop',        displayName: 'Royal Mail Click & Drop',         logoUrl: `${VOILA_CDN}/royalmail_clickanddrop.jpg` },
  'RoyalMailIntersoft':           { key: 'RoyalMailIntersoft',           displayName: 'Royal Mail Intersoft',            logoUrl: `${VOILA_CDN}/royalmail_intersoft.jpg` },
  'Rush':                         { key: 'Rush',                         displayName: 'Rush',                             logoUrl: `${VOILA_CDN}/rush.jpg` },
  'Samos':                        { key: 'Samos',                        displayName: 'Samos',                            logoUrl: `${VOILA_CDN}/samos-ecommerce.jpg` },
  'Seur':                         { key: 'Seur',                         displayName: 'Seur',                             logoUrl: `${VOILA_CDN}/seur.jpg` },
  'SharkDistribution':            { key: 'SharkDistribution',            displayName: 'Shark Distribution',              logoUrl: `${VOILA_CDN}/shark.jpg` },
  'Shippr':                       { key: 'Shippr',                       displayName: 'Shippr',                           logoUrl: `${VOILA_CDN}/shippr.jpg` },
  'SkyNet':                       { key: 'SkyNet',                       displayName: 'SkyNet Worldwide Express',         logoUrl: `${VOILA_CDN}/skynet.jpg` },
  'SmartTrack':                   { key: 'SmartTrack',                   displayName: 'Smart Track',                      logoUrl: `${VOILA_CDN}/smarttrack.jpg` },
  'SpringGlobal':                 { key: 'SpringGlobal',                 displayName: 'Spring Global',                    logoUrl: `${VOILA_CDN}/spring.jpg` },
  'SpringXBS':                    { key: 'SpringXBS',                    displayName: 'Spring XBS',                       logoUrl: `${VOILA_CDN}/spring.jpg` },
  'StampsUSPS':                   { key: 'StampsUSPS',                   displayName: 'Stamps USPS',                      logoUrl: `${VOILA_CDN}/usps.jpg` },
  'Starlinks':                    { key: 'Starlinks',                    displayName: 'Starlinks',                        logoUrl: `${VOILA_CDN}/starlinks.jpg` },
  'Stuart':                       { key: 'Stuart',                       displayName: 'Stuart',                           logoUrl: `${VOILA_CDN}/stuart-logo.jpg` },
  'Swap':                         { key: 'Swap',                         displayName: 'Swap',                             logoUrl: `${VOILA_CDN}/swap.jpg` },
  'Teleship':                     { key: 'Teleship',                     displayName: 'Teleship',                         logoUrl: `${VOILA_CDN}/teleship.png` },
  'Temu':                         { key: 'Temu',                         displayName: 'Temu',                             logoUrl: `${VOILA_CDN}/temu.jpg` },
  'SecuredMail':                  { key: 'SecuredMail',                  displayName: 'The Delivery Group',               logoUrl: `${VOILA_CDN}/securedmail.jpg` },
  'ThePalletNetwork':             { key: 'ThePalletNetwork',             displayName: 'The Pallet Network',               logoUrl: `${VOILA_CDN}/thepalletnetwork.jpg` },
  'THG':                          { key: 'THG',                          displayName: 'THG',                              logoUrl: `${VOILA_CDN}/thg.jpg` },
  'Tiari':                        { key: 'Tiari',                        displayName: 'Tiari',                            logoUrl: `${VOILA_CDN}/tiari.jpg` },
  'TikTokShop':                   { key: 'TikTokShop',                   displayName: 'TikTok Shop',                      logoUrl: `${VOILA_CDN}/tiktokshop.png` },
  'Tipsacarrier':                 { key: 'Tipsacarrier',                 displayName: 'Tipsacarrier',                     logoUrl: `${VOILA_CDN}/tipsa.png` },
  'TNT':                          { key: 'TNT',                          displayName: 'TNT',                              logoUrl: `${VOILA_CDN}/tnt.jpg` },
  'TomsTransit':                  { key: 'TomsTransit',                  displayName: 'Toms Transit',                     logoUrl: `${VOILA_CDN}/toms_transit.jpg` },
  'TotalFulfilment':              { key: 'TotalFulfilment',              displayName: 'Total Fulfilment',                 logoUrl: `${VOILA_CDN}/totalfulfilment.jpg` },
  'TransforceBE':                 { key: 'TransforceBE',                 displayName: 'Transforce BE',                    logoUrl: `${VOILA_CDN}/transforce.jpg` },
  'TransGlobal':                  { key: 'TransGlobal',                  displayName: 'Transglobal',                      logoUrl: `${VOILA_CDN}/transglobal.jpg` },
  'TransMission':                 { key: 'TransMission',                 displayName: 'TransMission',                     logoUrl: `${VOILA_CDN}/transmission.png` },
  'TrunkrsNL':                    { key: 'TrunkrsNL',                    displayName: 'Trunkrs',                          logoUrl: `${VOILA_CDN}/trunkrs.jpg` },
  'Tuffnells':                    { key: 'Tuffnells',                    displayName: 'Tuffnells',                        logoUrl: `${VOILA_CDN}/tuffnells.jpg` },
  'UKMail':                       { key: 'UKMail',                       displayName: 'UK Mail',                          logoUrl: `${VOILA_CDN}/ukmail.jpg` },
  'UPN':                          { key: 'UPN',                          displayName: 'UPN',                              logoUrl: `${VOILA_CDN}/upn.jpg` },
  'UPS':                          { key: 'UPS',                          displayName: 'UPS',                              logoUrl: `${VOILA_CDN}/ups.jpg` },
  'UPSv2':                        { key: 'UPSv2',                        displayName: 'UPSv2',                            logoUrl: `${VOILA_CDN}/ups.jpg` },
  'UrbIt':                        { key: 'UrbIt',                        displayName: 'Urb-it',                           logoUrl: `${VOILA_CDN}/urbit.jpg` },
  'Vamox':                        { key: 'Vamox',                        displayName: 'Vamox',                            logoUrl: `${VOILA_CDN}/vamox.jpg` },
  'Very':                         { key: 'Very',                         displayName: 'Very',                             logoUrl: `${VOILA_CDN}/very.jpg` },
  'WLogistics':                   { key: 'WLogistics',                   displayName: 'W Logistics',                      logoUrl: `${VOILA_CDN}/wlogistics.jpg` },
  'Wayfair':                      { key: 'Wayfair',                      displayName: 'Wayfair',                          logoUrl: `${VOILA_CDN}/wayfair.jpg` },
  'Whistl':                       { key: 'Whistl',                       displayName: 'Whistl',                           logoUrl: `${VOILA_CDN}/whistl.jpg` },
  'WorldwideShipping':            { key: 'WorldwideShipping',            displayName: 'Worldwide Shipping Solutions',     logoUrl: `${VOILA_CDN}/worldwideshipping.jpg` },
  'XDP':                          { key: 'XDP',                          displayName: 'XDP',                              logoUrl: `${VOILA_CDN}/xdp.jpg` },
  'Yodel':                        { key: 'Yodel',                        displayName: 'Yodel',                            logoUrl: `${VOILA_CDN}/yodel.jpg` },
  'YodelC2C':                     { key: 'YodelC2C',                     displayName: 'Yodel C2C',                        logoUrl: `${VOILA_CDN}/yodel.jpg` },
  'YodelECR':                     { key: 'YodelECR',                     displayName: 'Yodel ECR',                        logoUrl: `${VOILA_CDN}/yodel.jpg` },
  'YodelLink':                    { key: 'YodelLink',                    displayName: 'Yodel Link',                       logoUrl: `${VOILA_CDN}/yodel.jpg` },
  'YodelReturns':                 { key: 'YodelReturns',                 displayName: 'Yodel Returns',                    logoUrl: `${VOILA_CDN}/yodel.jpg` },
  'YunExpress':                   { key: 'YunExpress',                   displayName: 'Yun Express',                      logoUrl: `${VOILA_CDN}/yunexpress.jpg` },
  'YunExpressUSA':                { key: 'YunExpressUSA',                displayName: 'Yun Express USA',                  logoUrl: `${VOILA_CDN}/yunexpress.jpg` },
  'Zedify':                       { key: 'Zedify',                       displayName: 'Zedify',                           logoUrl: `${VOILA_CDN}/zedify.jpg` },
}

// Fetch ALL active carriers from DB — returns byKey and byName maps.
// DB data always takes priority over CARRIER_FALLBACKS.
export async function fetchCarrierMap(): Promise<{
  byKey:  Record<string, CarrierData>
  byName: Record<string, CarrierData>
}> {
  if (!process.env.DATABASE_URL) return { byKey: {}, byName: {} }

  try {
    const { db } = await import('@/lib/db')
    const rows = await db.carrier.findMany({
      where: { isActive: true },
      select: { key: true, displayName: true, logoUrl: true },
    })
    return {
      byKey:  Object.fromEntries(rows.map(r => [r.key, r])),
      byName: Object.fromEntries(rows.map(r => [r.displayName.toLowerCase(), r])),
    }
  } catch (err) {
    console.warn('[carriers] DB fetch failed, using fallbacks:', err)
    return { byKey: {}, byName: {} }
  }
}

// Resolve a carrier by Voila key, then display name, then hardcoded fallback.
export function resolveCarrier(
  key: string,
  byKey: Record<string, CarrierData>,
  byName: Record<string, CarrierData>,
): CarrierData {
  return (
    byKey[key] ??
    byName[key.toLowerCase()] ??
    CARRIER_FALLBACKS[key] ??
    CARRIER_FALLBACKS[key.toLowerCase()] ??
    { key, displayName: key, logoUrl: null }
  )
}
