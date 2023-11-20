<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* blog_list.html.twig */
class __TwigTemplate_d077b875248c39135ea9d5091482a5886c45a0402a18b3a8d73e85d6cbe1a5c8 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'content' => [$this, 'block_content'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return "partials/page.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 3
        $context["collection"] = $this->getAttribute(($context["page"] ?? null), "collection", [], "method");
        // line 1
        $this->parent = $this->loadTemplate("partials/page.html.twig", "blog_list.html.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 5
    public function block_content($context, array $blocks = [])
    {
        // line 6
        echo "
    ";
        // line 7
        if ($this->getAttribute(($context["page"] ?? null), "content", [])) {
            // line 8
            echo "        <div class=\"blog-header\">
            ";
            // line 9
            echo $this->getAttribute(($context["page"] ?? null), "content", []);
            echo "
        </div>
    ";
        }
        // line 12
        echo "
    <div class=\"list-blog cols-";
        // line 13
        echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "content", []), "columns", []), "html", null, true);
        echo "\">

        ";
        // line 16
        echo "        ";
        if (($this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "content", []), "leading", []) > 0)) {
            // line 17
            echo "            ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(twig_slice($this->env, ($context["collection"] ?? null), 0, $this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "content", []), "leading", [])));
            $context['loop'] = [
              'parent' => $context['_parent'],
              'index0' => 0,
              'index'  => 1,
              'first'  => true,
            ];
            if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof \Countable)) {
                $length = count($context['_seq']);
                $context['loop']['revindex0'] = $length - 1;
                $context['loop']['revindex'] = $length;
                $context['loop']['length'] = $length;
                $context['loop']['last'] = 1 === $length;
            }
            foreach ($context['_seq'] as $context["_key"] => $context["child"]) {
                // line 18
                echo "                <div class=\"list-blog-row\">
                    ";
                // line 19
                $this->loadTemplate("partials/blog_item.html.twig", "blog_list.html.twig", 19)->display(twig_array_merge($context, ["blog" => ($context["page"] ?? null), "page" => $context["child"], "truncate" => true, "show_date" => $this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "content", []), "show_date", [])]));
                // line 20
                echo "                </div>
            ";
                ++$context['loop']['index0'];
                ++$context['loop']['index'];
                $context['loop']['first'] = false;
                if (isset($context['loop']['length'])) {
                    --$context['loop']['revindex0'];
                    --$context['loop']['revindex'];
                    $context['loop']['last'] = 0 === $context['loop']['revindex0'];
                }
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['child'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 22
            echo "        ";
        }
        // line 23
        echo "
        ";
        // line 25
        echo "        ";
        if (($this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "content", []), "columns", []) > 1)) {
            // line 26
            echo "            ";
            if ($this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "content", []), "leading", [])) {
                // line 27
                echo "                ";
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable(twig_array_batch(twig_slice($this->env, ($context["collection"] ?? null), $this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "content", []), "leading", [])), $this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "content", []), "columns", [])));
                $context['loop'] = [
                  'parent' => $context['_parent'],
                  'index0' => 0,
                  'index'  => 1,
                  'first'  => true,
                ];
                if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof \Countable)) {
                    $length = count($context['_seq']);
                    $context['loop']['revindex0'] = $length - 1;
                    $context['loop']['revindex'] = $length;
                    $context['loop']['length'] = $length;
                    $context['loop']['last'] = 1 === $length;
                }
                foreach ($context['_seq'] as $context["_key"] => $context["row"]) {
                    // line 28
                    echo "                    <div class=\"list-blog-row\">
                        ";
                    // line 29
                    $context['_parent'] = $context;
                    $context['_seq'] = twig_ensure_traversable($context["row"]);
                    $context['loop'] = [
                      'parent' => $context['_parent'],
                      'index0' => 0,
                      'index'  => 1,
                      'first'  => true,
                    ];
                    if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof \Countable)) {
                        $length = count($context['_seq']);
                        $context['loop']['revindex0'] = $length - 1;
                        $context['loop']['revindex'] = $length;
                        $context['loop']['length'] = $length;
                        $context['loop']['last'] = 1 === $length;
                    }
                    foreach ($context['_seq'] as $context["_key"] => $context["child"]) {
                        // line 30
                        echo "                            ";
                        $this->loadTemplate("partials/blog_item.html.twig", "blog_list.html.twig", 30)->display(twig_array_merge($context, ["blog" => ($context["page"] ?? null), "page" => $context["child"], "truncate" => true, "show_date" => $this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "content", []), "show_date", [])]));
                        // line 31
                        echo "                        ";
                        ++$context['loop']['index0'];
                        ++$context['loop']['index'];
                        $context['loop']['first'] = false;
                        if (isset($context['loop']['length'])) {
                            --$context['loop']['revindex0'];
                            --$context['loop']['revindex'];
                            $context['loop']['last'] = 0 === $context['loop']['revindex0'];
                        }
                    }
                    $_parent = $context['_parent'];
                    unset($context['_seq'], $context['_iterated'], $context['_key'], $context['child'], $context['_parent'], $context['loop']);
                    $context = array_intersect_key($context, $_parent) + $_parent;
                    // line 32
                    echo "                    </div>
                ";
                    ++$context['loop']['index0'];
                    ++$context['loop']['index'];
                    $context['loop']['first'] = false;
                    if (isset($context['loop']['length'])) {
                        --$context['loop']['revindex0'];
                        --$context['loop']['revindex'];
                        $context['loop']['last'] = 0 === $context['loop']['revindex0'];
                    }
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['row'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 34
                echo "            ";
            } else {
                // line 35
                echo "                ";
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable(twig_array_batch(($context["collection"] ?? null), $this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "content", []), "columns", [])));
                $context['loop'] = [
                  'parent' => $context['_parent'],
                  'index0' => 0,
                  'index'  => 1,
                  'first'  => true,
                ];
                if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof \Countable)) {
                    $length = count($context['_seq']);
                    $context['loop']['revindex0'] = $length - 1;
                    $context['loop']['revindex'] = $length;
                    $context['loop']['length'] = $length;
                    $context['loop']['last'] = 1 === $length;
                }
                foreach ($context['_seq'] as $context["_key"] => $context["row"]) {
                    // line 36
                    echo "                    <div class=\"list-blog-row\">
                        ";
                    // line 37
                    $context['_parent'] = $context;
                    $context['_seq'] = twig_ensure_traversable($context["row"]);
                    $context['loop'] = [
                      'parent' => $context['_parent'],
                      'index0' => 0,
                      'index'  => 1,
                      'first'  => true,
                    ];
                    if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof \Countable)) {
                        $length = count($context['_seq']);
                        $context['loop']['revindex0'] = $length - 1;
                        $context['loop']['revindex'] = $length;
                        $context['loop']['length'] = $length;
                        $context['loop']['last'] = 1 === $length;
                    }
                    foreach ($context['_seq'] as $context["_key"] => $context["child"]) {
                        // line 38
                        echo "                            ";
                        $this->loadTemplate("partials/blog_item.html.twig", "blog_list.html.twig", 38)->display(twig_array_merge($context, ["blog" => ($context["page"] ?? null), "page" => $context["child"], "truncate" => true, "show_date" => $this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "content", []), "show_date", [])]));
                        // line 39
                        echo "                        ";
                        ++$context['loop']['index0'];
                        ++$context['loop']['index'];
                        $context['loop']['first'] = false;
                        if (isset($context['loop']['length'])) {
                            --$context['loop']['revindex0'];
                            --$context['loop']['revindex'];
                            $context['loop']['last'] = 0 === $context['loop']['revindex0'];
                        }
                    }
                    $_parent = $context['_parent'];
                    unset($context['_seq'], $context['_iterated'], $context['_key'], $context['child'], $context['_parent'], $context['loop']);
                    $context = array_intersect_key($context, $_parent) + $_parent;
                    // line 40
                    echo "                    </div>
                ";
                    ++$context['loop']['index0'];
                    ++$context['loop']['index'];
                    $context['loop']['first'] = false;
                    if (isset($context['loop']['length'])) {
                        --$context['loop']['revindex0'];
                        --$context['loop']['revindex'];
                        $context['loop']['last'] = 0 === $context['loop']['revindex0'];
                    }
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['row'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 42
                echo "            ";
            }
            // line 43
            echo "        ";
        } else {
            // line 44
            echo "            ";
            if (($this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "content", []), "leading", []) > 0)) {
                // line 45
                echo "                ";
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable(twig_slice($this->env, ($context["collection"] ?? null), $this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "content", []), "leading", [])));
                $context['loop'] = [
                  'parent' => $context['_parent'],
                  'index0' => 0,
                  'index'  => 1,
                  'first'  => true,
                ];
                if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof \Countable)) {
                    $length = count($context['_seq']);
                    $context['loop']['revindex0'] = $length - 1;
                    $context['loop']['revindex'] = $length;
                    $context['loop']['length'] = $length;
                    $context['loop']['last'] = 1 === $length;
                }
                foreach ($context['_seq'] as $context["_key"] => $context["child"]) {
                    // line 46
                    echo "                    ";
                    $this->loadTemplate("partials/blog_item.html.twig", "blog_list.html.twig", 46)->display(twig_array_merge($context, ["blog" => ($context["page"] ?? null), "page" => $context["child"], "truncate" => true, "show_date" => $this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "content", []), "show_date", [])]));
                    // line 47
                    echo "                ";
                    ++$context['loop']['index0'];
                    ++$context['loop']['index'];
                    $context['loop']['first'] = false;
                    if (isset($context['loop']['length'])) {
                        --$context['loop']['revindex0'];
                        --$context['loop']['revindex'];
                        $context['loop']['last'] = 0 === $context['loop']['revindex0'];
                    }
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['child'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 48
                echo "            ";
            } else {
                // line 49
                echo "                ";
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable(($context["collection"] ?? null));
                $context['loop'] = [
                  'parent' => $context['_parent'],
                  'index0' => 0,
                  'index'  => 1,
                  'first'  => true,
                ];
                if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof \Countable)) {
                    $length = count($context['_seq']);
                    $context['loop']['revindex0'] = $length - 1;
                    $context['loop']['revindex'] = $length;
                    $context['loop']['length'] = $length;
                    $context['loop']['last'] = 1 === $length;
                }
                foreach ($context['_seq'] as $context["_key"] => $context["child"]) {
                    // line 50
                    echo "                    ";
                    $this->loadTemplate("partials/blog_item.html.twig", "blog_list.html.twig", 50)->display(twig_array_merge($context, ["blog" => ($context["page"] ?? null), "page" => $context["child"], "truncate" => true, "show_date" => $this->getAttribute($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "content", []), "show_date", [])]));
                    // line 51
                    echo "                ";
                    ++$context['loop']['index0'];
                    ++$context['loop']['index'];
                    $context['loop']['first'] = false;
                    if (isset($context['loop']['length'])) {
                        --$context['loop']['revindex0'];
                        --$context['loop']['revindex'];
                        $context['loop']['last'] = 0 === $context['loop']['revindex0'];
                    }
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['child'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 52
                echo "            ";
            }
            // line 53
            echo "        ";
        }
        // line 54
        echo "    </div>

    ";
        // line 56
        if (($this->getAttribute($this->getAttribute($this->getAttribute(($context["config"] ?? null), "plugins", []), "pagination", []), "enabled", []) && $this->getAttribute($this->getAttribute(($context["collection"] ?? null), "params", []), "pagination", []))) {
            // line 57
            echo "        ";
            $this->loadTemplate("partials/pagination.html.twig", "blog_list.html.twig", 57)->display(twig_array_merge($context, ["base_url" => $this->getAttribute(($context["page"] ?? null), "url", []), "pagination" => $this->getAttribute($this->getAttribute(($context["collection"] ?? null), "params", []), "pagination", [])]));
            // line 58
            echo "    ";
        }
    }

    public function getTemplateName()
    {
        return "blog_list.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  360 => 58,  357 => 57,  355 => 56,  351 => 54,  348 => 53,  345 => 52,  331 => 51,  328 => 50,  310 => 49,  307 => 48,  293 => 47,  290 => 46,  272 => 45,  269 => 44,  266 => 43,  263 => 42,  248 => 40,  234 => 39,  231 => 38,  214 => 37,  211 => 36,  193 => 35,  190 => 34,  175 => 32,  161 => 31,  158 => 30,  141 => 29,  138 => 28,  120 => 27,  117 => 26,  114 => 25,  111 => 23,  108 => 22,  93 => 20,  91 => 19,  88 => 18,  70 => 17,  67 => 16,  62 => 13,  59 => 12,  53 => 9,  50 => 8,  48 => 7,  45 => 6,  42 => 5,  37 => 1,  35 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"partials/page.html.twig\" %}

{% set collection = page.collection() %}

{% block content %}

    {% if page.content %}
        <div class=\"blog-header\">
            {{ page.content|raw }}
        </div>
    {% endif %}

    <div class=\"list-blog cols-{{ page.header.content.columns }}\">

        {# Leading #}
        {% if page.header.content.leading > 0 %}
            {% for child in collection | slice(0, page.header.content.leading) %}
                <div class=\"list-blog-row\">
                    {% include 'partials/blog_item.html.twig' with {'blog': page, 'page': child, 'truncate': true, 'show_date': page.header.content.show_date } %}
                </div>
            {% endfor %}
        {% endif %}

        {# Column Layout #}
        {% if page.header.content.columns > 1 %}
            {% if page.header.content.leading %}
                {% for row in collection | slice(page.header.content.leading) | batch(page.header.content.columns) %}
                    <div class=\"list-blog-row\">
                        {% for child in row %}
                            {% include 'partials/blog_item.html.twig' with {'blog': page, 'page': child, 'truncate': true, 'show_date': page.header.content.show_date} %}
                        {% endfor %}
                    </div>
                {% endfor %}
            {% else %}
                {% for row in collection | batch(page.header.content.columns) %}
                    <div class=\"list-blog-row\">
                        {% for child in row %}
                            {% include 'partials/blog_item.html.twig' with {'blog': page, 'page': child, 'truncate': true, 'show_date': page.header.content.show_date} %}
                        {% endfor %}
                    </div>
                {% endfor %}
            {% endif %}
        {% else %}
            {% if page.header.content.leading > 0 %}
                {% for child in collection | slice(page.header.content.leading) %}
                    {% include 'partials/blog_item.html.twig' with {'blog': page, 'page': child, 'truncate': true, 'show_date': page.header.content.show_date} %}
                {% endfor %}
            {% else %}
                {% for child in collection %}
                    {% include 'partials/blog_item.html.twig' with {'blog': page, 'page': child, 'truncate': true, 'show_date': page.header.content.show_date} %}
                {% endfor %}
            {% endif %}
        {% endif %}
    </div>

    {% if config.plugins.pagination.enabled and collection.params.pagination %}
        {% include 'partials/pagination.html.twig' with {'base_url': page.url, 'pagination': collection.params.pagination} %}
    {% endif %}
{% endblock %}
", "blog_list.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\engines\\nucleus\\templates\\blog_list.html.twig");
    }
}
