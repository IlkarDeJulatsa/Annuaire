var MARKER_LAYER;var SELECT_CONTROL;var TYPES_MARQUEUR=new Array();TYPES_MARQUEUR.push("pays");TYPES_MARQUEUR.push("ville");TYPE_MARQUEUR_PAYS_ID=0;TYPE_MARQUEUR_VILLE_ID=1;function init_marqueur(){MARKER_LAYER=new OpenLayers.Layer.Vector("Overlay");CARTE.addLayer(MARKER_LAYER);SELECT_CONTROL=new OpenLayers.Control.SelectFeature(MARKER_LAYER,{onSelect:clicSurMarqueur});CARTE.addControl(SELECT_CONTROL);SELECT_CONTROL.activate();miseAjourDesMarqueurs()}function clicSurMarqueur(feature){var type=feature.attributes.type;var nom=feature.attributes.nom;var id=feature.attributes.id;if(type==TYPES_MARQUEUR[TYPE_MARQUEUR_PAYS_ID]){HTML(ARRAY_FILTRE_PAYS[ARRAY_FILTRE_ID]).value=id;action_modificationFiltre(ARRAY_FILTRE_PAYS[ARRAY_FILTRE_ID])}else{alimenterModale(id,NOMBRE_LIGNES,1);afficherModale();SELECT_CONTROL.unselect(feature)}}function ajout_marqueur(type,option){var coordonnees=new OpenLayers.LonLat(option.getAttribute("longitude"),option.getAttribute("latitude"));var position=getPositionCarte(coordonnees);var point=new OpenLayers.Geometry.Point(position.lon,position.lat);var feature=new OpenLayers.Feature.Vector(point,{type:type,nom:option.text,id:option.value},{externalGraphic:'/assets/images/map/marqueur.png',graphicHeight:21,graphicWidth:16});MARKER_LAYER.addFeatures(feature)}function miseAjourDesMarqueurs(){if(MARKER_LAYER){MARKER_LAYER.destroyFeatures()}var filtre_pays=HTML(ARRAY_FILTRE_PAYS[ARRAY_FILTRE_ID]);var filtre_ville=HTML(ARRAY_FILTRE_VILLE[ARRAY_FILTRE_ID]);if(filtre_pays.selectedIndex==0){var nombre_pays=filtre_pays.options.length;for(var i=1;i<nombre_pays;i++){ajout_marqueur(TYPES_MARQUEUR[TYPE_MARQUEUR_PAYS_ID],filtre_pays.options[i])}}else{if(filtre_ville.selectedIndex==0){zoom(filtre_pays.options[filtre_pays.selectedIndex]);var nombre_ville=filtre_ville.options.length;for(var i=1;i<nombre_ville;i++){ajout_marqueur(TYPES_MARQUEUR[TYPE_MARQUEUR_VILLE_ID],filtre_ville.options[i])}}else{var filtreville_ID=filtre_ville.selectedIndex;ajout_marqueur(TYPES_MARQUEUR[TYPE_MARQUEUR_VILLE_ID],filtre_ville.options[filtreville_ID])}}}