/**
 * Cette fonction est utilisee lors de la selection du filtre_ecole ou du
 * filtre_entreprise par l'utilisateur afin de remplacer un filtre par l'autre
 */
function miseAJourEcoleOuEntreprise() {
	var filtre_ecoleOuEntreprise = HTML('filtre_ecoleOuEntreprise').value;

	var td_ecoleOuEntreprise = HTML('td_ecoleOuEntreprise');
	td_ecoleOuEntreprise.innerHTML = '';

	var filtre = document.createElement('select');
	var filtre_option_par_defaut = document.createElement('option');

	if (filtre_ecoleOuEntreprise == 'filtre_entreprise') {
		filtre.setAttribute('name', 'Entreprise');
		filtre.setAttribute('id', ARRAY_FILTRE_ENTREPRISE[ARRAY_FILTRE_ID]);

		filtre_option_par_defaut.innerHTML = ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_OPTION_PAR_DEFAUT];

	} else {
		filtre.setAttribute('name', 'Ecole');
		filtre.setAttribute('id', ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID]);

		filtre_option_par_defaut.innerHTML = ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_OPTION_PAR_DEFAUT];

	}

	filtre.setAttribute('onChange', 'miseAJourDesFiltres(this.id)');
	filtre.appendChild(filtre_option_par_defaut);
	HTML('td_ecoleOuEntreprise').appendChild(filtre);

	// Remise a jour de tous les filtres
	resetAll();

	// Alimentation du filtre
	if (filtre_ecoleOuEntreprise == 'filtre_entreprise') {
		initialisationFiltreEntreprise();
	} else {
		initialisationFiltreEcole();
	}

}

/** Cette fonction reinitialise tous les filtres */
function resetAll() {
	miseAJourDesFiltres();
}

function selectionneArrayFiltreSelonID(filtre_ID) {
	if (ARRAY_FILTRE_CENTRALIEN[ARRAY_FILTRE_ID] == filtre_ID) {
		return ARRAY_FILTRE_CENTRALIEN;
	} else if (ARRAY_FILTRE_ANNEEPROMOTION[ARRAY_FILTRE_ID] == filtre_ID) {
		return ARRAY_FILTRE_ANNEEPROMOTION;
	} else if (ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID] == filtre_ID) {
		return ARRAY_FILTRE_ECOLE;
	} else if (ARRAY_FILTRE_ENTREPRISE[ARRAY_FILTRE_ID] == filtre_ID) {
		return ARRAY_FILTRE_ENTREPRISE;
	} else if (ARRAY_FILTRE_SECTEUR[ARRAY_FILTRE_ID] == filtre_ID) {
		return ARRAY_FILTRE_SECTEUR;
	} else if (ARRAY_FILTRE_PAYS[ARRAY_FILTRE_ID] == filtre_ID) {
		return ARRAY_FILTRE_PAYS;
	} else if (ARRAY_FILTRE_VILLE[ARRAY_FILTRE_ID] == filtre_ID) {
		return ARRAY_FILTRE_VILLE;
	}
}

function selectionneNumeroFiltreSelonID(filtre_ID) {
	if (ARRAY_FILTRE_CENTRALIEN[ARRAY_FILTRE_ID] == filtre_ID) {
		return ARRAY_FILTRES_CENTRALIEN;
	} else if (ARRAY_FILTRE_ANNEEPROMOTION[ARRAY_FILTRE_ID] == filtre_ID) {
		return ARRAY_FILTRES_ANNEEPROMOTION;
	} else if (ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID] == filtre_ID) {
		return ARRAY_FILTRES_ECOLE;
	} else if (ARRAY_FILTRE_ENTREPRISE[ARRAY_FILTRE_ID] == filtre_ID) {
		return ARRAY_FILTRES_ENTREPRISE;
	} else if (ARRAY_FILTRE_SECTEUR[ARRAY_FILTRE_ID] == filtre_ID) {
		return ARRAY_FILTRES_SECTEUR;
	} else if (ARRAY_FILTRE_PAYS[ARRAY_FILTRE_ID] == filtre_ID) {
		return ARRAY_FILTRES_PAYS;
	} else if (ARRAY_FILTRE_VILLE[ARRAY_FILTRE_ID] == filtre_ID) {
		return ARRAY_FILTRES_VILLE;
	}
}

function calculTableauOrdreActivation() {
	var tableau_ordre_maj = new Array();
	var tableau_ordre_maj_idFiltre = new Array();

	for (id_array_filtres in ARRAY_FILTRES) {
		var ordre_activation = ARRAY_FILTRES[id_array_filtres][ARRAY_FILTRE_ORDRE_ACTIVATION];
		if (ordre_activation > 0) {
			var taille_tableau_ordre_maj = tableau_ordre_maj.length;
			if (taille_tableau_ordre_maj == 0) {
				tableau_ordre_maj.push(ordre_activation);
				tableau_ordre_maj_idFiltre.push(id_array_filtres);
			} else {
				var increment = 0;
				// Tant que l'on a pas trouve plus grand on continue a
				// chercher
				while (ordre_activation > tableau_ordre_maj[increment]
						&& increment < taille_tableau_ordre_maj) {
					increment++;
				}

				if (increment != taille_tableau_ordre_maj) {
					// on decale tout pour inserer le filtre plus
					// prioritaire
					var precedent_ordre = 0;
					var precedent_id = 0;
					for (i = increment; i < taille_tableau_ordre_maj; i++) {
						precedent_tmp = tableau_ordre_maj[i];
						tableau_ordre_maj[i] = precedent_ordre;
						precedent_ordre = precedent_tmp;

						precedent_tmp = tableau_ordre_maj_idFiltre[i];
						tableau_ordre_maj_idFiltre[i] = precedent_id;
						precedent_id = precedent_tmp;
					}
					// On insere la derniere valeur a la fin du tableau
					tableau_ordre_maj.push(precedent_ordre);
					tableau_ordre_maj_idFiltre.push(precedent_id);

					// Et on insere notre valeur
					tableau_ordre_maj[increment] = ordre_activation;
					tableau_ordre_maj_idFiltre[increment] = id_array_filtres;

				} else {
					// Sinon le filtre actuel est le plus grand donc il se
					// met a la fin du tableau
					tableau_ordre_maj.push(ordre_activation);
					tableau_ordre_maj_idFiltre.push(id_array_filtres);
				}
			}
		}
	}

	for (id_array_filtres in ARRAY_FILTRES) {
		var ordre_activation = ARRAY_FILTRES[id_array_filtres][ARRAY_FILTRE_ORDRE_ACTIVATION];
		// On rajoute les filtres non actives
		if (ordre_activation < 0) {
			tableau_ordre_maj_idFiltre.push(id_array_filtres);
		}
	}
	return tableau_ordre_maj_idFiltre;
}

/**
 * Cette fonction est appelee lorsque l'un des filtres a ete modifie. Les autres
 * filtres sont mis a jour en consequence apres requetage de la BDD. Si tous les
 * filtres doivent être modifies, il suffit de ne pas donner de parametre
 */
function miseAJourDesFiltres(filtre_ID) {
	// Si pas de parametre (et qu'au moins un des filtres doit etre reinitialise
	// !), alors tous les filtres sont reinitialise
	if (!filtre_ID) {
		if (HTML(ARRAY_FILTRE_CENTRALIEN[ARRAY_FILTRE_ID]).selectedIndex != 0
				|| HTML(ARRAY_FILTRE_ANNEEPROMOTION[ARRAY_FILTRE_ID]).selectedIndex != 0
				|| (HTML(ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID]) && HTML(ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID]).selectedIndex != 0)
				|| (HTML(ARRAY_FILTRE_ENTREPRISE[ARRAY_FILTRE_ID]) && HTML(ARRAY_FILTRE_ENTREPRISE[ARRAY_FILTRE_ID]).selectedIndex != 0)
				|| HTML(ARRAY_FILTRE_SECTEUR[ARRAY_FILTRE_ID]).selectedIndex != 0
				|| HTML(ARRAY_FILTRE_PAYS[ARRAY_FILTRE_ID]).selectedIndex != 0
				|| (HTML(ARRAY_FILTRE_VILLE[ARRAY_FILTRE_ID]) && HTML(ARRAY_FILTRE_VILLE[ARRAY_FILTRE_ID]).selectedIndex != 0)) {
			var centralien_nom = null;
			var anneePromotion_libelle = null;
			var ecole_nom = null;
			var entreprise_nom = null;
			var secteur_nom = null;
			var pays_nom = null;
			var ville_nom = null;

			// Il faut indiquer au serveur quel est le filtre ignore entre Ecole
			// et Entreprise
			if (HTML(ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID])) {
				entreprise_nom = ECOLE_OU_ENTREPRISE_INACTIF;
			} else {
				ecole_nom = ECOLE_OU_ENTREPRISE_INACTIF;
			}

			miseAJourDuFiltreCentralien(anneePromotion_libelle, ecole_nom,
					entreprise_nom, secteur_nom, pays_nom, ville_nom);
			miseAJourDuFiltreAnneePromotion(centralien_nom, ecole_nom,
					entreprise_nom, secteur_nom, pays_nom, ville_nom);
			if (HTML(ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID])) {
				miseAJourDuFiltreEcole(centralien_nom, anneePromotion_libelle,
						secteur_nom, pays_nom, ville_nom);
			} else {
				miseAJourDuFiltreEntreprise(centralien_nom,
						anneePromotion_libelle, secteur_nom, pays_nom,
						ville_nom);
			}
			miseAJourDuFiltreSecteur(centralien_nom, anneePromotion_libelle,
					ecole_nom, entreprise_nom, pays_nom, ville_nom);
			miseAJourDuFiltrePays(centralien_nom, anneePromotion_libelle,
					ecole_nom, entreprise_nom, secteur_nom);
			// TODO : supprimer la ligne d'apres ?
			HTML(ARRAY_FILTRE_PAYS[ARRAY_FILTRE_ID]).selectedIndex = 0;
			miseAJourDuFiltreVille(centralien_nom, anneePromotion_libelle,
					ecole_nom, entreprise_nom, secteur_nom, pays_nom);

			// Ne pas oublier de reinitialiser l'ordre d'activation des filtres
			// !
			ORDRE_ACTIVATION_DERNIERE_VALEUR = 1;
			ARRAY_FILTRE_CENTRALIEN[ARRAY_FILTRE_ORDRE_ACTIVATION] = ORDRE_ACTIVATION_PAR_DEFAUT;
			ARRAY_FILTRE_ANNEEPROMOTION[ARRAY_FILTRE_ORDRE_ACTIVATION] = ORDRE_ACTIVATION_PAR_DEFAUT;
			ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ORDRE_ACTIVATION] = ORDRE_ACTIVATION_PAR_DEFAUT;
			ARRAY_FILTRE_ENTREPRISE[ARRAY_FILTRE_ORDRE_ACTIVATION] = ORDRE_ACTIVATION_PAR_DEFAUT;
			ARRAY_FILTRE_SECTEUR[ARRAY_FILTRE_ORDRE_ACTIVATION] = ORDRE_ACTIVATION_PAR_DEFAUT;
			ARRAY_FILTRE_PAYS[ARRAY_FILTRE_ORDRE_ACTIVATION] = ORDRE_ACTIVATION_PAR_DEFAUT;
			ARRAY_FILTRE_VILLE[ARRAY_FILTRE_ORDRE_ACTIVATION] = ORDRE_ACTIVATION_PAR_DEFAUT;
		}

	} else {
		// Si le filtre vient d'etre re-modifie, il faut remettre à jour les
		// filtres pour lesquels l'activation a
		// ete realisee apres celle de ce premier
		var arrayDuFiltreModifie = selectionneArrayFiltreSelonID(filtre_ID);
		var ordreActivationDuFiltreReinitialise = NOMBRE_TOTAL_FILTRES + 1;
		if (arrayDuFiltreModifie[ARRAY_FILTRE_ORDRE_ACTIVATION] != ORDRE_ACTIVATION_PAR_DEFAUT) {
			ordreActivationDuFiltreReinitialise = arrayDuFiltreModifie[ARRAY_FILTRE_ORDRE_ACTIVATION];
		} else {
			arrayDuFiltreModifie[ARRAY_FILTRE_ORDRE_ACTIVATION] = ORDRE_ACTIVATION_DERNIERE_VALEUR;
			ORDRE_ACTIVATION_DERNIERE_VALEUR++;
		}

		tableau_ordre_activation = calculTableauOrdreActivation();

		// On trouve ou est situe le filtre concerne par l'appel dans le
		// tableau tableau_ordre_activation
		var numeroFiltreModifie = selectionneNumeroFiltreSelonID(filtre_ID);
		var numeroFiltreModifieDansOA = 0;
		while (numeroFiltreModifie != tableau_ordre_activation[numeroFiltreModifieDansOA]) {
			numeroFiltreModifieDansOA++;
		}
		// Les filtres qui ont ete active apres sont mis a jour par rapport a
		// (tout) ceux active avant
		var tailleTableauOA = tableau_ordre_activation.length;
		for ( var i = numeroFiltreModifieDansOA + 1; i < tailleTableauOA; i++) {
			var centralien_nom;
			var anneePromotion_libelle;
			var ecole_nom;
			var entreprise_nom;
			var secteur_nom;
			var pays_nom;
			var ville_nom;

			// Il faut indiquer au serveur quel est le filtre ignore entre Ecole
			// et Entreprise
			if (HTML(ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID])) {
				entreprise_nom = ECOLE_OU_ENTREPRISE_INACTIF;
			} else {
				ecole_nom = ECOLE_OU_ENTREPRISE_INACTIF;
			}

			for ( var j = 0; j < i; j++) {
				if (ARRAY_FILTRES[tableau_ordre_activation[j]][ARRAY_FILTRE_ORDRE_ACTIVATION] != -1
						&& HTML(ARRAY_FILTRES[tableau_ordre_activation[i]][ARRAY_FILTRE_ID])
						&& HTML(ARRAY_FILTRES[tableau_ordre_activation[j]][ARRAY_FILTRE_ID]).selectedIndex != 0) {
					if (tableau_ordre_activation[j] == ARRAY_FILTRES_CENTRALIEN) {
						centralien_nom = HTML(ARRAY_FILTRES[tableau_ordre_activation[j]][ARRAY_FILTRE_ID]).value;
					} else if (tableau_ordre_activation[j] == ARRAY_FILTRES_ANNEEPROMOTION) {
						anneePromotion_libelle = HTML(ARRAY_FILTRES[tableau_ordre_activation[j]][ARRAY_FILTRE_ID]).value;
					} else if (tableau_ordre_activation[j] == ARRAY_FILTRES_ECOLE) {
						ecole_nom = HTML(ARRAY_FILTRES[tableau_ordre_activation[j]][ARRAY_FILTRE_ID]).value;
					} else if (tableau_ordre_activation[j] == ARRAY_FILTRES_ENTREPRISE) {
						entreprise_nom = HTML(ARRAY_FILTRES[tableau_ordre_activation[j]][ARRAY_FILTRE_ID]).value;
					} else if (tableau_ordre_activation[j] == ARRAY_FILTRES_SECTEUR) {
						secteur_nom = HTML(ARRAY_FILTRES[tableau_ordre_activation[j]][ARRAY_FILTRE_ID]).value;
					} else if (tableau_ordre_activation[j] == ARRAY_FILTRES_PAYS) {
						pays_nom = HTML(ARRAY_FILTRES[tableau_ordre_activation[j]][ARRAY_FILTRE_ID]).value;
					} else if (tableau_ordre_activation[j] == ARRAY_FILTRES_VILLE) {
						ville_nom = HTML(ARRAY_FILTRES[tableau_ordre_activation[j]][ARRAY_FILTRE_ID]).value;
					}
				}
			}

			if (tableau_ordre_activation[i] == ARRAY_FILTRES_CENTRALIEN) {
				miseAJourDuFiltreCentralien(anneePromotion_libelle, ecole_nom,
						entreprise_nom, secteur_nom, pays_nom, ville_nom);
			}
			if (tableau_ordre_activation[i] == ARRAY_FILTRES_ANNEEPROMOTION) {
				miseAJourDuFiltreAnneePromotion(centralien_nom, ecole_nom,
						entreprise_nom, secteur_nom, pays_nom, ville_nom);
			}
			if (HTML(ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID])
					&& tableau_ordre_activation[i] == ARRAY_FILTRES_ECOLE) {
				miseAJourDuFiltreEcole(centralien_nom, anneePromotion_libelle,
						secteur_nom, pays_nom, ville_nom);
			}
			if (HTML(ARRAY_FILTRE_ENTREPRISE[ARRAY_FILTRE_ID])
					&& tableau_ordre_activation[i] == ARRAY_FILTRES_ENTREPRISE) {
				miseAJourDuFiltreEntreprise(centralien_nom,
						anneePromotion_libelle, secteur_nom, pays_nom,
						ville_nom);
			}
			if (tableau_ordre_activation[i] == ARRAY_FILTRES_SECTEUR) {
				miseAJourDuFiltreSecteur(centralien_nom,
						anneePromotion_libelle, ecole_nom, entreprise_nom,
						pays_nom, ville_nom);
			}
			if (tableau_ordre_activation[i] == ARRAY_FILTRES_PAYS) {
				miseAJourDuFiltrePays(centralien_nom, anneePromotion_libelle,
						ecole_nom, entreprise_nom, secteur_nom);
			}
			if (tableau_ordre_activation[i] == ARRAY_FILTRES_VILLE) {
				miseAJourDuFiltreVille(centralien_nom, anneePromotion_libelle,
						ecole_nom, entreprise_nom, secteur_nom, pays_nom);
			}
		}

		// Si le filtre avait ete reinitialise alors on remet a -1 la valeur
		// d'ordre d'activation du filtre reinitialise et on decremente de 1 les
		// filtres actives apres lui
		if (HTML(filtre_ID).selectedIndex == '0') {
			// TODO : mettre une boucle for
			if (ARRAY_FILTRE_CENTRALIEN[ARRAY_FILTRE_ORDRE_ACTIVATION] > ordreActivationDuFiltreReinitialise) {
				ARRAY_FILTRE_CENTRALIEN[ARRAY_FILTRE_ORDRE_ACTIVATION]--;
			}
			if (ARRAY_FILTRE_ANNEEPROMOTION[ARRAY_FILTRE_ORDRE_ACTIVATION] > ordreActivationDuFiltreReinitialise) {
				ARRAY_FILTRE_ANNEEPROMOTION[ARRAY_FILTRE_ORDRE_ACTIVATION]--;
			}
			if (ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ORDRE_ACTIVATION] > ordreActivationDuFiltreReinitialise) {
				ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ORDRE_ACTIVATION]--;
			}
			if (ARRAY_FILTRE_ENTREPRISE[ARRAY_FILTRE_ORDRE_ACTIVATION] > ordreActivationDuFiltreReinitialise) {
				ARRAY_FILTRE_ENTREPRISE[ARRAY_FILTRE_ORDRE_ACTIVATION]--;
			}
			if (ARRAY_FILTRE_SECTEUR[ARRAY_FILTRE_ORDRE_ACTIVATION] > ordreActivationDuFiltreReinitialise) {
				ARRAY_FILTRE_SECTEUR[ARRAY_FILTRE_ORDRE_ACTIVATION]--;
			}
			if (ARRAY_FILTRE_PAYS[ARRAY_FILTRE_ORDRE_ACTIVATION] > ordreActivationDuFiltreReinitialise) {
				ARRAY_FILTRE_PAYS[ARRAY_FILTRE_ORDRE_ACTIVATION]--;
			}
			if (ARRAY_FILTRE_VILLE[ARRAY_FILTRE_ORDRE_ACTIVATION] > ordreActivationDuFiltreReinitialise) {
				ARRAY_FILTRE_VILLE[ARRAY_FILTRE_ORDRE_ACTIVATION]--;
			}
			arrayDuFiltreModifie[ARRAY_FILTRE_ORDRE_ACTIVATION] = -1;
		}
	}
}

// TODO : essayer de faire une fonction generique de mise a jour
function miseAJourDuFiltreCentralien(anneePromotion_libelle, ecole_nom,
		entreprise_nom, secteur_nom, pays_nom, ville_nom) {
	jsRoutes.controllers.ServiceCentralien
			.AJAX_listeDesCentraliensSelonCriteres(
					anneePromotion_libelle ? anneePromotion_libelle : "",
					ecole_nom ? ecole_nom : "",
					entreprise_nom ? entreprise_nom : "",
					secteur_nom ? secteur_nom : "", pays_nom ? pays_nom : "",
					ville_nom ? ville_nom : "")
			.ajax(
					{
						async : false,
						success : function(data, textStatus, jqXHR) {
							var filtre_centralien = HTML(ARRAY_FILTRE_CENTRALIEN[ARRAY_FILTRE_ID]);

							// Suppression des elements existants dans le filtre
							var valeurPrecedemmentSelectionnee;
							if (filtre_centralien.selectedIndex != 0
									&& (anneePromotion_libelle
											|| ecole_nom
											&& ecole_nom != ECOLE_OU_ENTREPRISE_INACTIF
											|| entreprise_nom
											&& entreprise_nom != ECOLE_OU_ENTREPRISE_INACTIF
											|| secteur_nom || pays_nom || ville_nom)) {
								valeurPrecedemmentSelectionnee = filtre_anneePromotion.value;
							}
							filtre_centralien.innerHTML = "";
							filtre_centralien_option_par_defaut = document
									.createElement('option');
							filtre_centralien_option_par_defaut.innerHTML = ARRAY_FILTRE_CENTRALIEN[ARRAY_FILTRE_OPTION_PAR_DEFAUT];
							filtre_centralien
									.appendChild(filtre_centralien_option_par_defaut);

							// Ajout des nouveaux elements
							for ( var element in data) {
								if (data[element] == valeurPrecedemmentSelectionnee) {
									option_precedemment_selectionnee = document
											.createElement('option');
									option_precedemment_selectionnee.innerHTML = data[element];
									option_precedemment_selectionnee
											.setAttribute('selected',
													'selected');
									filtre_centralien
											.appendChild(option_precedemment_selectionnee);
								} else {
									filtre_centralien.options[filtre_centralien.options.length] = new Option(
											data[element]);
								}
							}
						}
					});
}

function miseAJourDuFiltreAnneePromotion(centralien_nom, ecole_nom,
		entreprise_nom, secteur_nom, pays_nom, ville_nom) {

	jsRoutes.controllers.ServiceAnneePromotion
			.AJAX_listeDesAnneesPromotionSelonCriteres(
					centralien_nom ? centralien_nom : "",
					ecole_nom ? ecole_nom : "",
					entreprise_nom ? entreprise_nom : "",
					secteur_nom ? secteur_nom : "", pays_nom ? pays_nom : "",
					ville_nom ? ville_nom : "")
			.ajax(
					{
						async : false,
						success : function(data, textStatus, jqXHR) {
							var filtre_anneePromotion = HTML(ARRAY_FILTRE_ANNEEPROMOTION[ARRAY_FILTRE_ID]);

							// Suppression des elements existants dans le filtre
							var valeurPrecedemmentSelectionnee;
							if (filtre_anneePromotion.selectedIndex != 0
									&& (ecole_nom
											&& ecole_nom != ECOLE_OU_ENTREPRISE_INACTIF
											|| entreprise_nom
											&& entreprise_nom != ECOLE_OU_ENTREPRISE_INACTIF
											|| secteur_nom || pays_nom || ville_nom)) {
								valeurPrecedemmentSelectionnee = filtre_anneePromotion.value;
							}
							filtre_anneePromotion.innerHTML = "";
							filtre_anneePromotion_option_par_defaut = document
									.createElement('option');
							filtre_anneePromotion_option_par_defaut.innerHTML = ARRAY_FILTRE_ANNEEPROMOTION[ARRAY_FILTRE_OPTION_PAR_DEFAUT];
							filtre_anneePromotion
									.appendChild(filtre_anneePromotion_option_par_defaut);

							// Ajout des nouveaux elements
							for ( var element in data) {
								if (data[element] == valeurPrecedemmentSelectionnee) {
									option_precedemment_selectionnee = document
											.createElement('option');
									option_precedemment_selectionnee.innerHTML = data[element];
									option_precedemment_selectionnee
											.setAttribute('selected',
													'selected');
									filtre_anneePromotion
											.appendChild(option_precedemment_selectionnee);
								} else {
									filtre_anneePromotion.options[filtre_anneePromotion.options.length] = new Option(
											data[element]);
								}
							}
						}
					});
}

function miseAJourDuFiltreEcole(centralien_nom, anneePromotion_libelle,
		secteur_nom, pays_nom, ville_nom) {
	jsRoutes.controllers.ServiceEcole
			.AJAX_listeDesEcolesSelonCriteres(
					centralien_nom ? centralien_nom : "",
					anneePromotion_libelle ? anneePromotion_libelle : "",
					secteur_nom ? secteur_nom : "", pays_nom ? pays_nom : "",
					ville_nom ? ville_nom : "")
			.ajax(
					{
						async : false,
						success : function(data, textStatus, jqXHR) {
							var filtre_ecole = HTML(ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_ID]);

							// Suppression des elements existants dans le filtre
							var valeurPrecedemmentSelectionnee;
							if (filtre_ecole.selectedIndex != 0
									&& (anneePromotion_libelle || secteur_nom
											|| pays_nom || ville_nom)) {
								valeurPrecedemmentSelectionnee = filtre_ecole.value;
							}
							filtre_ecole.innerHTML = "";
							filtre_ecole_option_par_defaut = document
									.createElement('option');
							filtre_ecole_option_par_defaut.innerHTML = ARRAY_FILTRE_ECOLE[ARRAY_FILTRE_OPTION_PAR_DEFAUT];
							filtre_ecole
									.appendChild(filtre_ecole_option_par_defaut);

							// Ajout des nouveaux elements
							for ( var element in data) {
								if (data[element] == valeurPrecedemmentSelectionnee) {
									option_precedemment_selectionnee = document
											.createElement('option');
									option_precedemment_selectionnee.innerHTML = data[element];
									option_precedemment_selectionnee
											.setAttribute('selected',
													'selected');
									filtre_ecole
											.appendChild(option_precedemment_selectionnee);
								} else {
									filtre_ecole.options[filtre_ecole.options.length] = new Option(
											data[element]);
								}
							}
						}
					});
}

function miseAJourDuFiltreEntreprise(centralien_nom, anneePromotion_libelle,
		secteur_nom, pays_nom, ville_nom) {
	jsRoutes.controllers.ServiceEntreprise
			.AJAX_listeDesEntreprisesSelonCriteres(
					centralien_nom ? centralien_nom : "",
					anneePromotion_libelle ? anneePromotion_libelle : "",
					secteur_nom ? secteur_nom : "", pays_nom ? pays_nom : "",
					ville_nom ? ville_nom : "")
			.ajax(
					{
						async : false,
						success : function(data, textStatus, jqXHR) {
							var filtre_entreprise = HTML(ARRAY_FILTRE_ENTREPRISE[ARRAY_FILTRE_ID]);

							// Suppression des elements existants dans le filtre
							var valeurPrecedemmentSelectionnee;
							if (filtre_entreprise.selectedIndex != 0
									&& (anneePromotion_libelle || secteur_nom
											|| pays_nom || ville_nom)) {
								valeurPrecedemmentSelectionnee = filtre_entreprise.value;
							}
							filtre_entreprise.innerHTML = "";
							filtre_entreprise_option_par_defaut = document
									.createElement('option');
							filtre_entreprise_option_par_defaut.innerHTML = ARRAY_FILTRE_ENTREPRISE[ARRAY_FILTRE_OPTION_PAR_DEFAUT];
							filtre_entreprise
									.appendChild(filtre_entreprise_option_par_defaut);

							// Ajout des nouveaux elements
							for ( var element in data) {
								if (data[element] == valeurPrecedemmentSelectionnee) {
									option_precedemment_selectionnee = document
											.createElement('option');
									option_precedemment_selectionnee.innerHTML = data[element];
									option_precedemment_selectionnee
											.setAttribute('selected',
													'selected');
									filtre_entreprise
											.appendChild(option_precedemment_selectionnee);
								} else {
									filtre_entreprise.options[filtre_entreprise.options.length] = new Option(
											data[element]);
								}
							}
						}
					});
}

function miseAJourDuFiltreSecteur(centralien_nom, anneePromotion_libelle,
		ecole_nom, entreprise_nom, pays_nom, ville_nom) {
	jsRoutes.controllers.ServiceSecteur
			.AJAX_listeDesSecteursSelonCriteres(
					centralien_nom ? centralien_nom : "",
					anneePromotion_libelle ? anneePromotion_libelle : "",
					ecole_nom ? ecole_nom : "",
					entreprise_nom ? entreprise_nom : "",
					pays_nom ? pays_nom : "", ville_nom ? ville_nom : "")
			.ajax(
					{
						async : false,
						success : function(data, textStatus, jqXHR) {
							var filtre_secteur = HTML(ARRAY_FILTRE_SECTEUR[ARRAY_FILTRE_ID]);

							// Suppression des elements existants dans le filtre
							var valeurPrecedemmentSelectionnee;
							if (filtre_secteur.selectedIndex != 0
									&& (anneePromotion_libelle
											|| ecole_nom
											&& ecole_nom != ECOLE_OU_ENTREPRISE_INACTIF
											|| entreprise_nom
											&& entreprise_nom != ECOLE_OU_ENTREPRISE_INACTIF
											|| pays_nom || ville_nom)) {
								valeurPrecedemmentSelectionnee = filtre_secteur.value;
							}
							filtre_secteur.innerHTML = "";
							filtre_secteur_option_par_defaut = document
									.createElement('option');
							filtre_secteur_option_par_defaut.innerHTML = ARRAY_FILTRE_SECTEUR[ARRAY_FILTRE_OPTION_PAR_DEFAUT];
							filtre_secteur
									.appendChild(filtre_secteur_option_par_defaut);

							// Ajout des nouveaux elements
							for ( var element in data) {
								if (data[element] == valeurPrecedemmentSelectionnee) {
									option_precedemment_selectionnee = document
											.createElement('option');
									option_precedemment_selectionnee.innerHTML = data[element];
									option_precedemment_selectionnee
											.setAttribute('selected',
													'selected');

									filtre_secteur
											.appendChild(option_precedemment_selectionnee);
								} else {
									filtre_secteur.options[filtre_secteur.options.length] = new Option(
											data[element]);
								}
							}
						}
					});
}

function miseAJourDuFiltrePays(centralien_nom, anneePromotion_libelle,
		ecole_nom, entreprise_nom, secteur_nom) {
	jsRoutes.controllers.ServicePays
			.AJAX_listeDesPaysSelonCriteres(
					centralien_nom ? centralien_nom : "",
					anneePromotion_libelle ? anneePromotion_libelle : "",
					ecole_nom ? ecole_nom : "",
					entreprise_nom ? entreprise_nom : "",
					secteur_nom ? secteur_nom : "")
			.ajax(
					{
						async : false,
						success : function(data, textStatus, jqXHR) {
							var filtre_pays = HTML(ARRAY_FILTRE_PAYS[ARRAY_FILTRE_ID]);

							// Suppression des elements existants dans le filtre
							var valeurPrecedemmentSelectionnee;
							if (filtre_pays.selectedIndex != 0
									&& (anneePromotion_libelle
											|| ecole_nom
											&& ecole_nom != ECOLE_OU_ENTREPRISE_INACTIF
											|| entreprise_nom
											&& entreprise_nom != ECOLE_OU_ENTREPRISE_INACTIF || secteur_nom)) {
								valeurPrecedemmentSelectionnee = filtre_pays.value;
							}
							filtre_pays.innerHTML = "";
							filtre_pays_option_par_defaut = document
									.createElement('option');
							filtre_pays_option_par_defaut.innerHTML = ARRAY_FILTRE_PAYS[ARRAY_FILTRE_OPTION_PAR_DEFAUT];
							filtre_pays
									.appendChild(filtre_pays_option_par_defaut);

							// Ajout des nouveaux elements
							for ( var element in data) {
								if (data[element] == valeurPrecedemmentSelectionnee) {
									option_precedemment_selectionnee = document
											.createElement('option');
									option_precedemment_selectionnee.innerHTML = data[element];
									option_precedemment_selectionnee
											.setAttribute('selected',
													'selected');
									filtre_pays
											.appendChild(option_precedemment_selectionnee);
								} else {
									filtre_pays.options[filtre_pays.options.length] = new Option(
											data[element]);
								}
							}
						}
					});

}

/**
 * Si le filtre pays n'etait pas renseigne alors le filtre ville apparait. La
 * carte zoome sur le pays concerne. Les marqueurs des villes où des centraliens
 * sont presents apparaissent
 */
function miseAJourDuFiltreVille(centralien_nom, anneePromotion_libelle,
		ecole_nom, entreprise_nom, secteur_nom, pays_nom) {

	if (!HTML(ARRAY_FILTRE_VILLE[ARRAY_FILTRE_ID])) {
		// Si le filtre ville n'existe pas et qu'un un pays a ete selectionne,
		// ce premier est cree avec les informations du pays
		if (HTML(ARRAY_FILTRE_PAYS[ARRAY_FILTRE_ID]).selectedIndex != 0) {
			creationAlimentation_filtreVille(pays_nom);
		}
	} else {
		// Si le filtre pays est desactive alors le filtre ville est retire du
		// panneau
		if (HTML(ARRAY_FILTRE_PAYS[ARRAY_FILTRE_ID]).selectedIndex == 0) {
			suppression_filtreVille();
		} else {
			jsRoutes.controllers.ServiceVille
					.AJAX_listeDesVillesSelonCriteres(
							centralien_nom ? centralien_nom : "",
							anneePromotion_libelle ? anneePromotion_libelle
									: "", ecole_nom ? ecole_nom : "",
							entreprise_nom ? entreprise_nom : "",
							secteur_nom ? secteur_nom : "",
							pays_nom ? pays_nom : "")
					.ajax(
							{
								async : false,
								success : function(data, textStatus, jqXHR) {
									var filtre_ville = HTML(ARRAY_FILTRE_VILLE[ARRAY_FILTRE_ID]);

									// Suppression des elements existants dans
									// le filtre
									var valeurPrecedemmentSelectionnee;
									if (filtre_ville.selectedIndex != 0
											&& (anneePromotion_libelle
													|| ecole_nom
													&& ecole_nom != ECOLE_OU_ENTREPRISE_INACTIF
													|| entreprise_nom
													&& entreprise_nom != ECOLE_OU_ENTREPRISE_INACTIF
													|| secteur_nom || pays_nom)) {
										valeurPrecedemmentSelectionnee = filtre_ville.value;
									}
									filtre_ville.innerHTML = "";
									filtre_ville_option_par_defaut = document
											.createElement('option');
									filtre_ville_option_par_defaut.innerHTML = ARRAY_FILTRE_VILLE[ARRAY_FILTRE_OPTION_PAR_DEFAUT];
									filtre_ville
											.appendChild(filtre_ville_option_par_defaut);

									// Ajout des nouveaux elements
									for ( var element in data) {
										if (data[element] == valeurPrecedemmentSelectionnee) {
											option_precedemment_selectionnee = document
													.createElement('option');
											option_precedemment_selectionnee.innerHTML = data[element];
											option_precedemment_selectionnee
													.setAttribute('selected',
															'selected');
											filtre_ville
													.appendChild(option_precedemment_selectionnee);
										} else {
											filtre_ville.options[filtre_ville.options.length] = new Option(
													data[element]);
										}
									}
								}
							});
		}

	}
	return null;
}

function suppression_filtreVille() {
	HTML('tableau_critere').removeChild(HTML('tr_ville'));
}
